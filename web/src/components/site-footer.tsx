import { Box, CodeBracket, Router } from "@/components/icons/geist";
import { getTranslations } from "next-intl/server";

import { stats } from "@/lib/ps";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const th = await getTranslations("header");

  return (
    <footer className="mt-auto border-t border-border/80 bg-background/80 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-heading-14">{th("brand")}</span>
            <span className="hidden text-muted-foreground sm:inline">/</span>
            <span className="hidden text-label-13 text-muted-foreground sm:inline">
              {th("brandSub")}
            </span>
          </div>
          <p className="max-w-md text-xs text-muted-foreground leading-relaxed">
            {t.rich("desc", {
              count: stats.total,
              link: (chunks) => (
                <a
                  href="https://sih.gov.in/sih2026PS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-3 hover:text-primary transition-colors"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/40 px-2 py-1">
            <Box className="size-3 text-gray-700 dark:text-gray-500" /> {stats.total} {t("pillTotal")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/40 px-2 py-1">
            <CodeBracket className="size-3 text-blue-700 dark:text-blue-600" /> {stats.software} {t("pillSoftware")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/40 px-2 py-1">
            <Router className="size-3 text-amber-700 dark:text-amber-500" /> {stats.hardware} {t("pillHardware")}
          </span>
        </div>
      </div>
    </footer>
  );
}
