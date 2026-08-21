import { CpuIcon, LayersIcon, ServerIcon } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div>
          <p className="text-sm font-medium">SIH 2026 Problem Statements</p>
          <p className="mt-1 max-w-md text-xs text-muted-foreground">
            Unofficial, community-maintained archive of the {""}
            <a
              href="https://sih.gov.in/sih2026PS"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              226 problem statements
            </a>{" "}
            published by Smart India Hackathon. Content: CC-BY-4.0 · Code: MIT.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <LayersIcon className="size-3.5" /> 226
          </span>
          <span className="flex items-center gap-1.5">
            <ServerIcon className="size-3.5" /> 172 SW
          </span>
          <span className="flex items-center gap-1.5">
            <CpuIcon className="size-3.5" /> 54 HW
          </span>
        </div>
      </div>
    </footer>
  );
}
