import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { useLocale, type Dict } from "@/i18n";
import { submitInfraRequest } from "@/lib/submissions.functions";
import {
  Arrow,
  Field,
  PageShellLite,
  SectionTitle,
  StatusLine,
  actionClass,
  fieldClass,
} from "@/components/site/Layout";

export function OnboardingPage({ t }: { t: Dict }) {
  const p = t.onboardingPage;
  const [state, setState] = useState<"idle" | "checking" | "done" | "error">("idle");
  const [ticket, setTicket] = useState("");
  const [queue, setQueue] = useState(1);
  const submitRequest = useServerFn(submitInfraRequest);
  const locale = useLocale();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("checking");
    try {
      const result = await submitRequest({
        data: {
          locale,
          org: String(form.get("org") ?? ""),
          domain: String(form.get("domain") ?? ""),
          stack: String(form.get("stack") ?? "webhosting") as
            "webhosting" | "vps" | "ksuite" | "custom",
          account: String(form.get("account") ?? "existing") as "existing" | "new",
          email: String(form.get("email") ?? ""),
          notes: String(form.get("notes") ?? ""),
          company: String(form.get("company") ?? ""),
        },
      });
      setTicket(result.ticket);
      setQueue(result.queue);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <PageShellLite index={p.index} title={p.title} lead={p.lead}>
      <section>
        <SectionTitle index={p.workflowIndex} title={p.workflowTitle} />
        <ol className="mt-8 divide-y divide-gridline border-y border-gridline">
          {t.steps.map(([id, title, body]) => (
            <li key={id} className="flex flex-col gap-2 py-6 md:flex-row md:gap-10">
              <span className="w-16 shrink-0 font-mono text-[10px] tracking-[0.22em] text-muted-ink">
                {id}
              </span>
              <div>
                <h3 className="text-lg text-ebony">{title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-ink">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionTitle index={p.formIndex} title={p.formTitle} />
        <div className="mt-8">
          {state === "done" ? (
            <div>
              <StatusLine label={p.doneTitle} />
              <dl className="mt-8 divide-y divide-gridline border-y border-gridline">
                {[
                  [p.doneRows[0], ticket],
                  [p.doneRows[1], String(queue).padStart(2, "0")],
                  [p.doneRows[2], p.doneValidation],
                  [p.doneRows[3], "core@delplanche.cloud"],
                  [p.doneRows[4], p.doneSetup],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-wrap justify-between gap-4 py-4">
                    <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase">
                      {k}
                    </dt>
                    <dd className="font-mono text-[11px] text-ebony">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-sm leading-relaxed text-muted-ink">{p.doneBody}</p>
              <button
                type="button"
                className={`${actionClass} mt-8`}
                onClick={() => setState("idle")}
              >
                {p.again} <Arrow />
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-8 md:grid-cols-2 md:gap-10">
              <div
                className="absolute -left-[10000px] h-px w-px overflow-hidden"
                aria-hidden="true"
              >
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <Field label={p.org}>
                <input required name="org" className={fieldClass} placeholder="Delplanche BV" />
              </Field>
              <Field label={p.domain}>
                <input required name="domain" className={fieldClass} placeholder="company.be" />
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
              <Field label={p.stack}>
                <div className="relative">
                  <select
                    required
                    name="stack"
                    defaultValue="webhosting"
                    className={`${fieldClass} cursor-pointer appearance-none rounded-none pr-8`}
                  >
                    {p.stackOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 font-mono text-[10px] tracking-[0.16em] text-muted-ink"
                  >
                    [ ▼ ]
                  </span>
                </div>
              </Field>
              <Field label={p.account}>
                <div className="flex flex-col gap-3 pt-1">
                  {[
                    ["existing", p.accountExisting],
                    ["new", p.accountNew],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 font-mono text-[11px] text-ebony"
                    >
                      <input
                        type="radio"
                        name="account"
                        value={value}
                        defaultChecked={value === "existing"}
                        className="h-3 w-3 accent-[var(--moss)]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </Field>
              <div className="md:col-span-2">
                <Field label={p.notes}>
                  <textarea
                    name="notes"
                    rows={4}
                    className={`${fieldClass} resize-none`}
                    placeholder={p.notesPlaceholder}
                  />
                </Field>
              </div>
              <div className="flex flex-wrap items-center gap-5 md:col-span-2">
                <button type="submit" disabled={state === "checking"} className={actionClass}>
                  {state === "checking" ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> {p.submitting}
                    </>
                  ) : (
                    <>
                      {p.submit} <Arrow />
                    </>
                  )}
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
    </PageShellLite>
  );
}
