import { useRef, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { useLocale, type Dict } from "@/i18n";
import {
  CATEGORY_ORDER,
  categoryLabel,
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

type UiStrings = {
  categoryLegend: string;
  categoryRequired: string;
  fieldsRequired: string;
  reference: string;
  errors: Record<"rate" | "spam" | "input" | "delivery" | "generic", string>;
};

const UI = {
  nl: {
    categoryLegend: "Onderwerp-categorie",
    categoryRequired: "Kies een categorie",
    fieldsRequired: "Selecteer eerst een onderwerp-categorie en vul alle velden in",
    reference: "Referentie",
    errors: {
      rate: "Te veel pogingen — probeer over enkele minuten opnieuw",
      spam: "Bericht geweigerd door de spamfilter — herformuleer of mail direct",
      input: "Controleer de ingevulde velden en probeer opnieuw",
      delivery: "Bezorging mislukt — mail direct naar core@delplanche.cloud",
      generic: "Verzenden mislukt — probeer opnieuw of mail direct",
    },
  },
  en: {
    categoryLegend: "Subject category",
    categoryRequired: "Choose a category",
    fieldsRequired: "Select a subject category and fill in every field first",
    reference: "Reference",
    errors: {
      rate: "Too many attempts — try again in a few minutes",
      spam: "Message rejected by the spam filter — rephrase or mail us directly",
      input: "Check the fields and try again",
      delivery: "Delivery failed — mail core@delplanche.cloud directly",
      generic: "Sending failed — try again or mail us directly",
    },
  },
  fr: {
    categoryLegend: "Catégorie du sujet",
    categoryRequired: "Choisissez une catégorie",
    fieldsRequired: "Choisissez d'abord une catégorie et remplissez tous les champs",
    reference: "Référence",
    errors: {
      rate: "Trop de tentatives — réessayez dans quelques minutes",
      spam: "Message refusé par le filtre anti-spam — reformulez ou écrivez-nous directement",
      input: "Vérifiez les champs et réessayez",
      delivery: "Échec de l'envoi — écrivez directement à core@delplanche.cloud",
      generic: "Échec de l'envoi — réessayez ou écrivez-nous directement",
    },
  },
} satisfies Record<string, UiStrings>;

function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `k_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function ContactPage({ t }: { t: Dict }) {
  const p = t.contactPage;
  const [copied, setCopied] = useState<"pgp" | "matrix" | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [category, setCategory] = useState<ContactCategory | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const locale = useLocale();
  const ui: UiStrings = (UI as Record<string, UiStrings>)[locale] ?? UI.nl;
  const idempotencyKey = useRef<string>(newIdempotencyKey());

  const copy = async (value: string, key: "pgp" | "matrix") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 2400);
    } catch {
      setCopied(null);
    }
  };

  const [summary, setSummary] = useState<{
    subject: string;
    email: string;
    reference?: string | undefined;
  } | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      locale,
      category: category as ContactCategory,
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      subject: String(form.get("subject") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
      company: String(form.get("company") ?? ""),
    };
    // Alles-in-één controle: geen stille no-op meer bij een ontbrekend veld.
    if (
      !category ||
      payload.name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) ||
      payload.subject.length < 2 ||
      payload.message.length < 10
    ) {
      setErrorMessage(ui.fieldsRequired);
      setState("error");
      return;
    }
    setState("sending");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const message =
          res.status === 429
            ? ui.errors.rate
            : res.status === 422
              ? ui.errors.spam
              : res.status === 400
                ? ui.errors.input
                : res.status === 502
                  ? ui.errors.delivery
                  : ui.errors.generic;
        setErrorMessage(message);
        setState("error");
        return;
      }
      const data = (await res.json().catch(() => null)) as { reference?: string } | null;
      setSummary({
        subject: payload.subject,
        email: payload.email,
        reference: data?.reference,
      });
      setState("sent");
    } catch {
      setErrorMessage(ui.errors.generic);
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
                    {summary.reference && (
                      <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                        <dt className="font-mono text-[9px] tracking-[0.18em] text-muted-ink uppercase sm:w-32">
                          {ui.reference}
                        </dt>
                        <dd className="font-mono text-[12px] text-ebony">{summary.reference}</dd>
                      </div>
                    )}
                  </dl>
                )}
                <button
                  type="button"
                  className={`${actionClass} mt-8`}
                  onClick={() => {
                    setSummary(null);
                    setCategory(null);
                    setErrorMessage(null);
                    idempotencyKey.current = newIdempotencyKey();
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
                  {ui.categoryLegend}
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
                        className={`inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-[10px] font-medium tracking-[0.16em] uppercase transition-all duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-moss ${
                        active
                            ? "border-ebony bg-ebony text-canvas font-semibold shadow-[0_1px_0_0_var(--ebony)] ring-1 ring-ebony"
                            : `bg-transparent text-muted-ink hover:border-ebony hover:text-ebony ${
                                state === "error" && !category
                                  ? "border-swiss-red"
                                  : "border-gridline-strong"
                              }`
                        }`}
                      >
                        {categoryLabel(key, locale)}
                      </button>
                    );
                  })}
                </div>
                {state === "error" && !category && (
                  <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-swiss-red uppercase">
                    {ui.categoryRequired}
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
              <div className="flex flex-col gap-4 md:col-span-2">
                {state === "error" && (
                  <p
                    role="alert"
                    aria-live="assertive"
                    className="border border-swiss-red/60 bg-swiss-red/5 px-4 py-3 font-mono text-[10px] leading-relaxed tracking-[0.16em] text-swiss-red uppercase"
                  >
                    {errorMessage ?? p.error}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-5">
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    aria-busy={state === "sending"}
                    className={`${actionClass} relative overflow-hidden transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70`}
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
                </div>
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
