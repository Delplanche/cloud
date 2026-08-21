import { useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { useLocale, type Dict } from "@/i18n";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type ContactCategory,
} from "@/lib/contact-categories";
import {
  Arrow,
  Field,
  PageShellLite,
  SectionTitle,
  StatusLine,
  actionClass,
  fieldClass,
} from "@/components/site/Layout";

const FINGERPRINT = "4A2B 8F91 C3E4 D5F6 7890 1234 5678 90AB CDEF 1234";
const MATRIX_ID = "@jona:delplanche.cloud";

export function ContactPage({ t }: { t: Dict }) {
  const p = t.contactPage;
  const [copied, setCopied] = useState<"pgp" | "matrix" | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [category, setCategory] = useState<ContactCategory | null>(null);
  const locale = useLocale();

  const copy = async (value: string, key: "pgp" | "matrix") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 2400);
    } catch {
      setCopied(null);
    }
  };

  const [summary, setSummary] = useState<{ subject: string; email: string } | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) return;
    const form = new FormData(e.currentTarget);
    const payload = {
      locale,
      category,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? ""),
    };
    setState("sending");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSummary({ subject: payload.subject, email: payload.email });
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <PageShellLite index={p.index} title={p.title} lead={p.lead}>
      <section>
        <SectionTitle index={p.formIndex} title={p.formTitle} lead={p.formLead} />
        <div className="mt-8">
          {state === "sent" ? (
            <div
              data-testid="contact-success"
              className="animate-in fade-in slide-in-from-bottom-2 max-w-2xl overflow-hidden border border-gridline-strong bg-card duration-500"
            >
              <div className="border-b border-gridline px-4 py-2.5 font-mono text-[9px] tracking-[0.2em] text-muted-ink uppercase">
                // TRANSMISSION RECEIVED
              </div>
              <div className="px-4 py-7 sm:px-6">
                <StatusLine label={p.sentTitle} />
                <p className="mt-5 text-sm leading-relaxed text-muted-ink">{p.sentBody}</p>
                {summary && (
                  <dl className="mt-7 divide-y divide-gridline border-y border-gridline">
                    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                      <dt className="font-mono text-[9px] tracking-[0.18em] text-muted-ink uppercase sm:w-32">
                        {p.subject}
                      </dt>
                      <dd className="font-mono text-[12px] text-ebony">{summary.subject}</dd>
                    </div>
                    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                      <dt className="font-mono text-[9px] tracking-[0.18em] text-muted-ink uppercase sm:w-32">
                        {p.email}
                      </dt>
                      <dd className="font-mono text-[12px] text-ebony">{summary.email}</dd>
                    </div>
                  </dl>
                )}
                <button
                  type="button"
                  className={`${actionClass} mt-8`}
                  onClick={() => {
                    setSummary(null);
                    setCategory(null);
                    setState("idle");
                  }}
                >
                  {p.again} <Arrow />
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className={`grid gap-8 transition-opacity duration-300 md:grid-cols-2 md:gap-10 ${
                state === "sending" ? "opacity-60" : "opacity-100"
              }`}
            >
              <div aria-hidden="true" className="hidden">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" tabIndex={-1} autoComplete="off" />
              </div>
              <fieldset className="md:col-span-2">
                <legend className="font-mono text-[10px] tracking-[0.18em] text-muted-ink uppercase">
                  Onderwerp-categorie
                </legend>
                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-required="true">
                  {CATEGORY_ORDER.map((key) => {
                    const active = category === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setCategory(key)}
                        className={`inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-moss ${
                          active
                            ? "border-ebony bg-ebony text-canvas"
                            : "border-gridline-strong bg-transparent text-muted-ink hover:border-ebony hover:text-ebony"
                        }`}
                      >
                        {CATEGORY_LABELS[key]}
                      </button>
                    );
                  })}
                </div>
                {state === "error" && !category && (
                  <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-ebony uppercase">
                    Kies een categorie
                  </p>
                )}
              </fieldset>
              <Field label={p.name}>
                <input required name="name" className={fieldClass} placeholder="Jona Delplanche" />
              </Field>
              <Field label={p.email}>
                <input
                  required
                  type="email"
                  name="email"
                  className={fieldClass}
                  placeholder="you@company.be"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label={p.subject}>
                  <input
                    required
                    name="subject"
                    className={fieldClass}
                    placeholder={p.subjectPlaceholder}
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label={p.message}>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    minLength={10}
                    className={`${fieldClass} resize-none`}
                    placeholder={p.messagePlaceholder}
                  />
                </Field>
              </div>
              <div className="flex flex-wrap items-center gap-5 md:col-span-2">
                <button
                  type="submit"
                  disabled={state === "sending" || !category}
                  aria-busy={state === "sending"}
                  className={`${actionClass} relative overflow-hidden transition-all duration-300`}
                >
                  <span
                    className={`flex items-center gap-2.5 transition-all duration-300 ${
                      state === "sending" ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {p.submit} <Arrow />
                  </span>
                  <span
                    aria-hidden={state !== "sending"}
                    className={`absolute inset-0 flex items-center justify-center gap-2.5 transition-opacity duration-300 ${
                      state === "sending" ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Loader2 size={12} className="animate-spin" /> {p.submitting}
                  </span>
                </button>
                <span className="font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase">
                  {p.zeroTracking}
                </span>
                {state === "error" && (
                  <span
                    aria-live="polite"
                    className="font-mono text-[10px] tracking-[0.16em] text-ebony uppercase"
                  >
                    {p.error}
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

      <section>
        <SectionTitle index={p.channelsIndex} title={p.channelsTitle} />
        <div className="mt-8 divide-y divide-gridline border-y border-gridline md:grid md:grid-cols-2 md:gap-12 md:divide-y-0">
          <div className="py-7">
            <span className="font-mono text-[10px] tracking-[0.18em] text-muted-ink uppercase">
              {p.mailLabel}
            </span>
            <a
              href="mailto:core@delplanche.cloud"
              className="mt-3 inline-flex min-h-11 items-center font-mono text-[14px] text-ebony transition-colors hover:text-moss focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-moss"
            >
              core@delplanche.cloud
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-ink">{p.mailNote}</p>
          </div>
          <div className="py-7">
            <span className="font-mono text-[10px] tracking-[0.18em] text-muted-ink uppercase">
              {p.matrixLabel}
            </span>
            <a
              href={`https://matrix.to/#/${MATRIX_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center font-mono text-[14px] text-ebony transition-colors hover:text-moss focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-moss"
            >
              {MATRIX_ID}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-ink">{p.matrixNote}</p>
            <button
              type="button"
              className={`${actionClass} mt-6`}
              onClick={() => copy(MATRIX_ID, "matrix")}
            >
              {copied === "matrix" ? <Check size={12} /> : <Copy size={12} />}
              {copied === "matrix" ? p.copied : p.copyMatrix}
            </button>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle index={p.verifyIndex} title={p.verifyTitle} lead={p.verifyLead} />
        <div className="mt-8 overflow-hidden rounded-none border border-gridline-strong bg-card">
          <div className="border-b border-gridline px-4 py-2.5 font-mono text-[9px] tracking-[0.2em] text-muted-ink uppercase">
            // PGP FINGERPRINT / SHA-256 CHECKSUM
          </div>
          <p className="px-4 py-5 font-mono text-[12.5px] leading-[1.9] font-medium tracking-[0.08em] break-words text-ebony md:text-[14px]">
            {FINGERPRINT}
          </p>
        </div>
        <button
          type="button"
          className={`${actionClass} mt-6`}
          onClick={() => copy(FINGERPRINT, "pgp")}
        >
          {copied === "pgp" ? <Check size={12} /> : <Copy size={12} />}
          {copied === "pgp" ? p.copied : p.copyFingerprint}
        </button>
      </section>
    </PageShellLite>
  );
}
