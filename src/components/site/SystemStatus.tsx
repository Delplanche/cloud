import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSystemStatus } from "@/lib/submissions.functions";

export function useSystemStatus() {
  const fetchStatus = useServerFn(getSystemStatus);
  return useQuery({
    queryKey: ["system-status"],
    queryFn: () => fetchStatus(),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function StatusPill() {
  const { data, isError } = useSystemStatus();
  const ok = data ? data.operational : !isError;

  return (
    <span className="flex items-center gap-2 border border-gridline bg-card px-3 py-1.5">
      <span className={ok ? "pulse-dot" : "pulse-dot pulse-dot-alert"} />
      <span
        className={`font-mono text-[9px] tracking-[0.18em] uppercase ${
          ok ? "text-moss" : "text-terracotta"
        }`}
      >
        {data
          ? ok
            ? `Swiss DC Active (Geneva) — ${data.latencyMs} ms`
            : "Degraded — Control Plane Unreachable"
          : "Swiss DC Active (Geneva) — Probing…"}
      </span>
    </span>
  );
}

export function StatusChannel({ className }: { className?: string }) {
  const { data, isError, isFetching, dataUpdatedAt } = useSystemStatus();
  const ok = data ? data.operational : !isError;
  const degraded = isError || (data ? !data.operational : false);
  const slow = !!data && data.operational && data.latencyMs > 800;

  const stamp = (iso: string | number) =>
    new Date(iso).toLocaleString("nl-BE", {
      hour12: false,
      dateStyle: "short",
      timeStyle: "medium",
    });

  const rows: [string, string][] = [
    ["Control plane", ok ? "Operational" : "Degraded"],
    ["Round-trip latency", data ? `${data.latencyMs} ms` : "—"],
    ["Region", data?.region ?? "Genève — CH (Tier 3+)"],
    ["Laatste uptime-check", data ? stamp(data.checkedAt) : "—"],
    ["Client-side probe", dataUpdatedAt ? stamp(dataUpdatedAt) : "—"],
    ["Probe-interval", "60 s"],
  ];

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className={ok ? "pulse-dot" : "pulse-dot pulse-dot-alert"} />
          <span className="label-mono">System Status (Live)</span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.18em] text-muted-ink uppercase">
          {isFetching ? "Probing…" : "Idle"}
        </span>
      </div>

      {degraded && (
        <div className="mt-4 border-l-2 border-terracotta bg-terracotta/8 px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.16em] text-terracotta uppercase">
            Incident — Control plane onbereikbaar
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-ink">
            De statusprobe kreeg geen antwoord van de Zwitserse control plane. Aanvragen worden
            mogelijk vertraagd verwerkt. Laatste geslaagde check:{" "}
            {data ? stamp(data.checkedAt) : "onbekend"}.
          </p>
        </div>
      )}

      {!degraded && slow && (
        <div className="mt-4 border-l-2 border-terracotta/60 bg-terracotta/5 px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.16em] text-terracotta uppercase">
            Waarschuwing — Verhoogde latency
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-ink">
            Round-trip van {data?.latencyMs} ms ligt boven de nominale drempel van 800 ms.
          </p>
        </div>
      )}

      {!degraded && !slow && (
        <div className="mt-4 border-l-2 border-moss bg-moss/5 px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.16em] text-moss uppercase">
            Nominal — Geen actieve incidenten
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-ink">
            Alle systemen operationeel. Laatste uptime-check: {data ? stamp(data.checkedAt) : "—"}.
          </p>
        </div>
      )}

      <dl className="mt-4 divide-y divide-gridline border-y border-gridline">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5">
            <dt className="label-mono">{k}</dt>
            <dd className="font-mono text-[10px] tracking-[0.12em] text-ebony uppercase">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
