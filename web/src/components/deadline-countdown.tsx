"use client";

import { CalendarClockIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-local-storage";
import { daysUntil, type ProblemStatement } from "@/lib/ps";

export function DeadlineCountdown({ ps }: { ps: ProblemStatement }) {
  const mounted = useMounted();

  if (!mounted) {
    return <Skeleton className="h-5 w-20 rounded-full" />;
  }

  const date = ps.deadline_date ? new Date(ps.deadline_date + "T00:00:00") : null;
  if (!date) return null;

  const days = daysUntil(date);
  let label = "Due today";
  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  if (days > 0) {
    label = days === 1 ? "Due tomorrow" : `Due in ${days} days`;
    variant = days <= 15 ? "destructive" : days <= 45 ? "outline" : "secondary";
  } else if (days < 0) {
    label = "Deadline passed";
    variant = "outline";
  }

  return (
    <Badge variant={variant} className="gap-1 font-medium">
      <CalendarClockIcon className="size-3" />
      {label}
    </Badge>
  );
}
