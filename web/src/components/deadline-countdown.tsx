"use client";

import { Clock } from "@/components/icons/geist";
import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-local-storage";
import { daysUntil, type ProblemStatement } from "@/lib/ps";

export function DeadlineCountdown({ ps }: { ps: ProblemStatement }) {
  const mounted = useMounted();
  const t = useTranslations("countdown");

  if (!mounted) {
    return <Skeleton className="h-6 w-24 rounded-full shrink-0" />;
  }

  const date = ps.deadline_date ? new Date(ps.deadline_date + "T00:00:00") : null;
  if (!date) return null;

  const days = daysUntil(date);
  let label = t("dueToday");
  let colorStyle = "border-green-600/30 bg-green-600/10 text-green-700 dark:text-green-500";
  if (days > 0) {
    label = days === 1 ? t("dueTomorrow") : t("dueIn", { days });
    if (days <= 15) {
      colorStyle = "border-red-600/30 bg-red-600/10 text-red-700 dark:text-red-500";
    } else if (days <= 45) {
      colorStyle = "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-500";
    }
  } else if (days < 0) {
    label = t("passed");
    colorStyle = "border-border/60 bg-muted/60 text-muted-foreground";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10.5px] font-medium tracking-tight whitespace-nowrap shrink-0 ${colorStyle}`}
    >
      <Clock className="size-3 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
