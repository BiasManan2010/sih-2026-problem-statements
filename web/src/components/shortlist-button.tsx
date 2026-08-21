"use client";

import { Star } from "@/components/icons/geist";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useShortlist } from "@/hooks/use-shortlist";

export function ShortlistButton({
  psNumber,
  variant = "ghost",
  size = "icon",
}: {
  psNumber: string;
  variant?: "ghost" | "outline" | "secondary";
  size?: "icon" | "sm";
}) {
  const { isShortlisted, toggle } = useShortlist();
  const active = isShortlisted(psNumber);
  const t = useTranslations("shortlistBtn");

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={active ? "secondary" : variant}
            size={size}
            className={
              size === "icon"
                ? `size-7 rounded-lg border border-border/60 ${active ? "bg-primary/15 border-primary/40 text-primary" : "bg-muted/30 hover:bg-muted/70 text-muted-foreground hover:text-foreground"} shrink-0 p-0 shadow-2xs transition-colors`
                : undefined
            }
            aria-label={active ? t("remove") : t("add")}
            aria-pressed={active}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(psNumber);
            }}
          >
            <Star className={active ? "size-3.5 fill-current" : "size-3.5"} />
          </Button>
        }
      />
      <TooltipContent>{active ? t("remove") : t("add")}</TooltipContent>
    </Tooltip>
  );
}
