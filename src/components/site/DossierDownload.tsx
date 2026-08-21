import { FileDown } from "lucide-react";
import { ActionButton } from "@/components/site/Layout";

export function DossierDownload({ label = "Download dossier (PDF)" }: { label?: string }) {
  return (
    <div className="no-print flex flex-wrap items-center gap-5">
      <ActionButton
        onClick={() => {
          if (typeof window !== "undefined") window.print();
        }}
      >
        <FileDown size={12} /> {label}
      </ActionButton>
      <span className="label-mono">Blauwdruk-export — A4, print-optimalisatie</span>
    </div>
  );
}
