"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const LOOKING_FOR_OPTIONS = [
  "A Job",
  "A Startup Partnership",
  "A Side Hustle",
  "To Share Opportunities",
  "Just Networking",
];

type Step = "welcome" | "form" | "submitting" | "thanks";

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeNewsletter, setAgreeNewsletter] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  const toggleOption = (option: string) => {
    setLookingFor((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email";
    if (!cvFile) newErrors.cv = "Please upload your CV";
    if (!agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms";
    if (!agreeNewsletter)
      newErrors.agreeNewsletter = "You must agree to receive the newsletter";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStep("submitting");

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone.trim());
    formData.append("cv", cvFile!);
    formData.append("lookingFor", JSON.stringify(lookingFor));

    try {
      const res = await fetch("/api/submit", { method: "POST", body: formData });
      if (res.ok) {
        setStep("thanks");
      } else {
        setStep("form");
        setErrors({ submit: "Something went wrong. Please try again." });
      }
    } catch {
      setStep("form");
      setErrors({ submit: "Something went wrong. Please try again." });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setCvFile(file);
  }, []);

  // ─── WELCOME PAGE ───
  if (step === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-5">
                <svg
                  className="w-7 h-7 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Welcome to Amitai Eliram&apos;s Professional Network
              </h1>
              <p className="mt-3 text-muted text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                Leave your details, upload your CV, and receive occasional
                opportunities directly to your inbox.
              </p>
            </div>

            {/* Terms */}
            <div className="bg-background rounded-xl p-5 sm:p-6 mb-8 border border-border">
              <h2 className="font-semibold text-foreground mb-4 text-sm sm:text-base">
                Terms of Joining &mdash; Amitai Eliram&apos;s Network
              </h2>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Thanks for joining. A few things you should know before you fill
                in the form:
              </p>
              <div className="space-y-4 text-sm text-muted leading-relaxed">
                <div>
                  <span className="font-medium text-foreground">
                    What this is.
                  </span>{" "}
                  A private network I run personally. Once a week I send a
                  newsletter with job openings, startup partnership
                  opportunities, and relevant content that comes my way. This is
                  a personal network &mdash; not a recruitment agency, no
                  commissions, no commercial agenda.
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    What I&apos;ll do with your details.
                  </span>{" "}
                  I&apos;ll keep them with me &mdash; and with me only &mdash;
                  review the list when an opportunity comes in, and include
                  relevant content in the weekly newsletter. If I spot a specific
                  match I&apos;ll reach out to you personally.
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    What I won&apos;t do.
                  </span>{" "}
                  I won&apos;t sell your details, I won&apos;t forward your CV
                  to anyone without asking you first, and I won&apos;t flood you
                  with messages.
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Leave anytime.
                  </span>{" "}
                  Want to opt out or have your details deleted? One email to me (
                  <a
                    href="mailto:amitai.eliram@gmail.com"
                    className="text-accent hover:underline"
                  >
                    amitai.eliram@gmail.com
                  </a>
                  ) and I&apos;ll take care of it within a few days. Every
                  newsletter will also include an unsubscribe link.
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Fair expectations.
                  </span>{" "}
                  I do this voluntarily. I can&apos;t guarantee that you&apos;ll
                  receive an offer, that anything will lead anywhere, or that the
                  other side will behave properly. Any opportunity I pass along
                  &mdash; it&apos;s your responsibility to vet it before moving
                  forward.
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Disclosure.
                  </span>{" "}
                  I am the CEO and owner of Congreat Ltd., but this network is a
                  personal activity of mine and is not affiliated with the
                  company&apos;s operations.
                </div>
                <div className="pt-2 border-t border-border text-muted">
                  &mdash; Amitai Eliram |{" "}
                  <a
                    href="mailto:amitai.eliram@gmail.com"
                    className="text-accent hover:underline"
                  >
                    amitai.eliram@gmail.com
                  </a>
                </div>
                <div className="font-medium text-foreground italic">
                  Good luck.
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setStep("form")}
              className="w-full py-4 bg-accent text-white font-semibold rounded-xl text-base sm:text-lg
                         hover:bg-accent-hover active:scale-[0.98] transition-all duration-200
                         shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 cursor-pointer"
            >
              Let&apos;s Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── SUBMITTING ───
  if (step === "submitting") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <svg
              className="w-8 h-8 text-accent animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <p className="text-muted text-lg">Submitting your details...</p>
        </div>
      </div>
    );
  }

  // ─── THANK YOU PAGE ───
  if (step === "thanks") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg text-center animate-slide-up">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 sm:p-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6 animate-scale-in">
              <svg
                className="w-10 h-10 text-success animate-checkmark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              You&apos;re In!
            </h1>
            <p className="text-muted text-base sm:text-lg leading-relaxed mb-2">
              Thanks for joining the network, <span className="font-medium text-foreground">{fullName}</span>.
            </p>
            <p className="text-muted text-sm sm:text-base leading-relaxed mb-8">
              Your details have been saved. Keep an eye on your inbox &mdash;
              the next newsletter is on its way.
            </p>
            <div className="bg-background rounded-xl p-5 border border-border text-left">
              <p className="text-sm text-muted mb-1">Questions? Reach out anytime:</p>
              <a
                href="mailto:amitai.eliram@gmail.com"
                className="text-accent font-medium hover:underline text-sm"
              >
                amitai.eliram@gmail.com
              </a>
            </div>
            <p className="mt-8 text-xs text-muted/60">
              &mdash; Amitai Eliram&apos;s Professional Network
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── FORM ───
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-10">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setStep("welcome")}
              className="flex items-center gap-1.5 text-muted hover:text-foreground text-sm mb-4 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Your Details
            </h1>
            <p className="text-muted text-sm mt-1">
              Fields marked with <span className="text-red-500">*</span> are required
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((p) => ({ ...p, fullName: "" }));
                }}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm
                           placeholder:text-muted/50 outline-none transition-all duration-200
                           focus:border-accent focus:ring-2 focus:ring-accent/20
                           ${errors.fullName ? "border-red-400 ring-2 ring-red-100" : "border-border"}`}
              />
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                }}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm
                           placeholder:text-muted/50 outline-none transition-all duration-200
                           focus:border-accent focus:ring-2 focus:ring-accent/20
                           ${errors.email ? "border-red-400 ring-2 ring-red-100" : "border-border"}`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm
                           placeholder:text-muted/50 outline-none transition-all duration-200
                           focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload Your CV <span className="text-red-500">*</span>
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`drop-zone relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer
                           ${dragOver ? "drag-over" : ""}
                           ${errors.cv ? "border-red-400 bg-red-50/50" : "border-border"}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCvFile(file);
                      if (errors.cv) setErrors((p) => ({ ...p, cv: "" }));
                    }
                  }}
                  className="hidden"
                />
                {cvFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{cvFile.name}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {(cvFile.size / 1024 / 1024).toFixed(2)} MB &middot;{" "}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCvFile(null);
                          }}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-muted/40 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm text-muted">
                      <span className="text-accent font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted/60 mt-1">PDF, DOC, DOCX</p>
                  </>
                )}
              </div>
              {errors.cv && (
                <p className="mt-1.5 text-xs text-red-500">{errors.cv}</p>
              )}
            </div>

            {/* Looking For */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                What are you looking for? Pick as many as you like.
              </label>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleOption(option)}
                    className={`chip-option px-4 py-2.5 rounded-full border text-sm font-medium
                               ${
                                 lookingFor.includes(option)
                                   ? "selected"
                                   : "border-border text-muted hover:text-foreground"
                               }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Agreement 1 */}
            <div>
              <div className="flex items-start gap-3 group">
                <div
                  onClick={() => {
                    setAgreeTerms(!agreeTerms);
                    if (errors.agreeTerms) setErrors((p) => ({ ...p, agreeTerms: "" }));
                  }}
                  className={`custom-checkbox flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center cursor-pointer
                             ${agreeTerms ? "checked" : errors.agreeTerms ? "border-red-400" : "border-border group-hover:border-accent"}`}
                >
                  {agreeTerms && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => {
                    setAgreeTerms(!agreeTerms);
                    if (errors.agreeTerms) setErrors((p) => ({ ...p, agreeTerms: "" }));
                  }}
                  className="text-sm text-foreground leading-relaxed cursor-pointer"
                >
                  I have read the{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTermsPopup(true);
                    }}
                    className="text-accent underline hover:text-accent-hover cursor-pointer font-medium"
                  >
                    terms
                  </button>{" "}
                  and agree that my details will be stored
                  in Amitai Eliram&apos;s personal network.{" "}
                  <span className="text-red-500">*</span>
                </span>
              </div>
              {errors.agreeTerms && (
                <p className="mt-1.5 ml-8 text-xs text-red-500">
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            {/* Terms Popup */}
            {showTermsPopup && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
                onClick={() => setShowTermsPopup(false)}
              >
                <div
                  className="bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-scale-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-foreground text-base sm:text-lg">
                      Terms of Joining &mdash; Amitai Eliram&apos;s Network
                    </h2>
                    <button
                      onClick={() => setShowTermsPopup(false)}
                      className="text-muted hover:text-foreground transition-colors cursor-pointer p-1"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-muted text-sm leading-relaxed mb-4">
                    Thanks for joining. A few things you should know before you fill
                    in the form:
                  </p>
                  <div className="space-y-4 text-sm text-muted leading-relaxed">
                    <div>
                      <span className="font-medium text-foreground">What this is.</span>{" "}
                      A private network I run personally. Once a week I send a newsletter with job openings, startup partnership opportunities, and relevant content that comes my way. This is a personal network &mdash; not a recruitment agency, no commissions, no commercial agenda.
                    </div>
                    <div>
                      <span className="font-medium text-foreground">What I&apos;ll do with your details.</span>{" "}
                      I&apos;ll keep them with me &mdash; and with me only &mdash; review the list when an opportunity comes in, and include relevant content in the weekly newsletter. If I spot a specific match I&apos;ll reach out to you personally.
                    </div>
                    <div>
                      <span className="font-medium text-foreground">What I won&apos;t do.</span>{" "}
                      I won&apos;t sell your details, I won&apos;t forward your CV to anyone without asking you first, and I won&apos;t flood you with messages.
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Leave anytime.</span>{" "}
                      Want to opt out or have your details deleted? One email to me (<a href="mailto:amitai.eliram@gmail.com" className="text-accent hover:underline">amitai.eliram@gmail.com</a>) and I&apos;ll take care of it within a few days. Every newsletter will also include an unsubscribe link.
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Fair expectations.</span>{" "}
                      I do this voluntarily. I can&apos;t guarantee that you&apos;ll receive an offer, that anything will lead anywhere, or that the other side will behave properly. Any opportunity I pass along &mdash; it&apos;s your responsibility to vet it before moving forward.
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Disclosure.</span>{" "}
                      I am the CEO and owner of Congreat Ltd., but this network is a personal activity of mine and is not affiliated with the company&apos;s operations.
                    </div>
                    <div className="pt-2 border-t border-border text-muted">
                      &mdash; Amitai Eliram |{" "}
                      <a href="mailto:amitai.eliram@gmail.com" className="text-accent hover:underline">amitai.eliram@gmail.com</a>
                    </div>
                    <div className="font-medium text-foreground italic">Good luck.</div>
                  </div>
                  <button
                    onClick={() => setShowTermsPopup(false)}
                    className="w-full mt-6 py-3 bg-accent text-white font-semibold rounded-xl text-sm
                               hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Agreement 2 */}
            <div>
              <label
                onClick={() => {
                  setAgreeNewsletter(!agreeNewsletter);
                  if (errors.agreeNewsletter) setErrors((p) => ({ ...p, agreeNewsletter: "" }));
                }}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div
                  className={`custom-checkbox flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center
                             ${agreeNewsletter ? "checked" : errors.agreeNewsletter ? "border-red-400" : "border-border group-hover:border-accent"}`}
                >
                  {agreeNewsletter && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-foreground leading-relaxed">
                  I agree to receive the weekly newsletter with job openings,
                  partnerships, and content.{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.agreeNewsletter && (
                <p className="mt-1.5 ml-8 text-xs text-red-500">
                  {errors.agreeNewsletter}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-accent text-white font-semibold rounded-xl text-base
                         hover:bg-accent-hover active:scale-[0.98] transition-all duration-200
                         shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 cursor-pointer mt-2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
