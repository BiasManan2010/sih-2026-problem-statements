import { CpuIcon, LayersIcon, ServerIcon } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-background/80 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded-md bg-foreground text-background">
              <svg
                className="size-2.5 fill-current"
                viewBox="0 0 76 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <span className="font-semibold text-xs tracking-tight text-foreground">
              SIH 2026 Problem Statements
            </span>
          </div>
          <p className="max-w-md text-xs text-muted-foreground leading-relaxed">
            Community-maintained archive of all{" "}
            <a
              href="https://sih.gov.in/sih2026PS"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-3 hover:text-primary transition-colors"
            >
              226 problem statements
            </a>{" "}
            published for Smart India Hackathon 2026. Content: CC-BY-4.0 · Code: MIT.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/40 px-2 py-1">
            <LayersIcon className="size-3 text-gray-700 dark:text-gray-500" /> 226 total
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/40 px-2 py-1">
            <ServerIcon className="size-3 text-blue-700 dark:text-blue-600" /> 172 software
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/40 px-2 py-1">
            <CpuIcon className="size-3 text-amber-700 dark:text-amber-500" /> 54 hardware
          </span>
        </div>
      </div>
    </footer>
  );
}

