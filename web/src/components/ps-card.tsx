"use client";

import { Building2Icon, DatabaseIcon, TagIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { DeadlineCountdown } from "@/components/deadline-countdown";
import { Highlight, markQuery } from "@/components/highlight";
import { ShortlistButton } from "@/components/shortlist-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { descriptionExcerpt, type ProblemStatement } from "@/lib/ps";

export function PsCard({
  ps,
  query = "",
  variant = "grid",
}: {
  ps: ProblemStatement;
  query?: string;
  variant?: "grid" | "list";
}) {
  const title = useMemo(() => markQuery(ps.title, query), [ps.title, query]);
  const excerpt = useMemo(
    () => markQuery(descriptionExcerpt(ps, variant === "list" ? 300 : 180), query),
    [ps, query, variant],
  );

  return (
    <Card
      className={
        variant === "grid"
          ? "flex h-full flex-col overflow-hidden transition-colors hover:border-ring/50"
          : "overflow-hidden transition-colors hover:border-ring/50"
      }
    >
      <Link href={`/ps/${ps.ps_number}`} className="flex h-full flex-col">
        <CardContent
          className={variant === "grid" ? "flex flex-1 flex-col gap-3 p-5" : "flex flex-col gap-3 p-5 sm:flex-row sm:items-start"}
        >
          <div className={variant === "list" ? "flex-1 space-y-3" : "space-y-3"}>
            <div className="flex items-start justify-between gap-2">
              <Badge variant="outline" className="font-mono text-[11px]">
                {ps.ps_number}
              </Badge>
              <div className="flex items-center gap-2">
                <DeadlineCountdown ps={ps} />
                <div onClick={(e) => e.preventDefault()}>
                  <ShortlistButton psNumber={ps.ps_number} />
                </div>
              </div>
            </div>

            <h3 className="line-clamp-2 text-base font-semibold tracking-tight">
              <Highlight text={title} />
            </h3>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant={ps.category === "Software" ? "default" : "secondary"}>
                {ps.category}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <TagIcon className="size-3" />
                {ps.theme}
              </Badge>
              {ps.dataset_link.trim() && (
                <Badge variant="outline" className="gap-1">
                  <DatabaseIcon className="size-3" />
                  Dataset
                </Badge>
              )}
            </div>

            {variant === "list" ? (
              <p className="text-sm text-muted-foreground">
                <Highlight text={excerpt} />
              </p>
            ) : (
              <p className="sr-only">{descriptionExcerpt(ps, 180)}</p>
            )}
          </div>

          {variant === "list" && (
            <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:items-end">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2Icon className="size-3.5" />
                {ps.org}
              </span>
              <span className="text-xs text-muted-foreground">Deadline: {ps.deadline}</span>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
