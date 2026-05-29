import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import * as XLSX from "xlsx";

interface ResponseRow {
  "Full Name": string;
  Email: string;
  Phone: string;
  "CV File": string;
  "Looking For": string;
  "Submitted At": string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = (formData.get("phone") as string) || "";
    const cvFile = formData.get("cv") as File;
    const lookingFor = JSON.parse(
      (formData.get("lookingFor") as string) || "[]"
    );

    // Save CV to Vercel Blob
    const timestamp = Date.now();
    const safeName = fullName.replace(/[^a-zA-Z0-9]/g, "_");
    const ext = cvFile.name.split(".").pop() || "pdf";
    const cvFilename = `${safeName}_${timestamp}.${ext}`;

    await put(`cvs/${cvFilename}`, cvFile, {
      access: "public",
      addRandomSuffix: false,
    });

    // Build new row
    const newRow: ResponseRow = {
      "Full Name": fullName,
      Email: email,
      Phone: phone,
      "CV File": cvFilename,
      "Looking For": lookingFor.join(", "),
      "Submitted At": new Date().toISOString(),
    };

    // Read existing responses
    let rows: ResponseRow[] = [];
    try {
      const { blobs } = await list({ prefix: "data/" });
      const responsesBlob = blobs.find(
        (b) => b.pathname === "data/responses.json"
      );
      if (responsesBlob) {
        const res = await fetch(responsesBlob.url);
        rows = await res.json();
      }
    } catch {
      // First submission, no existing data
    }

    rows.push(newRow);

    // Save updated responses JSON
    await put("data/responses.json", JSON.stringify(rows, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    // Also generate and save Excel
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(rows);
    sheet["!cols"] = [
      { wch: 25 },
      { wch: 30 },
      { wch: 18 },
      { wch: 40 },
      { wch: 40 },
      { wch: 25 },
    ];
    XLSX.utils.book_append_sheet(workbook, sheet, "Responses");
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    await put("data/responses.xlsx", excelBuffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }
}
