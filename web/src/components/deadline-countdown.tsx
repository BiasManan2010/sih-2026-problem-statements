"use client";

import { CalendarClockIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-local-storage";
import { daysUntil, type ProblemStatement } from "@/lib/ps";

export function DeadlineCountdown({ ps }: { ps: ProblemStatement }) {
  const mounted = useMounted();

  if (!mounted) {
    return <Skeleton className="h-6 w-24 rounded-full shrink-0" />;
  }

  const date = ps.deadline_date ? new Date(ps.deadline_date + "T00:00:00") : null;
  if (!date) return null;

  const days = daysUntil(date);
  let label = "Due today";
  let colorStyle = "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (days > 0) {
    label = days === 1 ? "Due tomorrow" : `Due in ${days}d`;
    if (days <= 15) {
      colorStyle = "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    } else if (days <= 45) {
      colorStyle = "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
  } else if (days < 0) {
    label = "Passed";
    colorStyle = "border-border/60 bg-muted/60 text-muted-foreground";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10.5px] font-medium tracking-tight whitespace-nowrap shrink-0 ${colorStyle}`}
    >
      <CalendarClockIcon className="size-3 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
