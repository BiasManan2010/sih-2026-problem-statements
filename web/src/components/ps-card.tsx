"use client";

import { ArrowUpRightIcon, Building2Icon, DatabaseIcon, TagIcon } from "lucide-react";
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

  const isSoftware = ps.category === "Software";

  return (
    <Card
      className={
        variant === "grid"
          ? "group relative flex h-full flex-col overflow-hidden border-border/80 bg-card transition-all duration-200 hover:border-gray-500 dark:hover:border-gray-500 hover:shadow-md dark:hover:shadow-gray-1000/20"
          : "group relative overflow-hidden border-border/80 bg-card transition-all duration-200 hover:border-gray-500 dark:hover:border-gray-500 hover:shadow-md dark:hover:shadow-gray-1000/20"
      }
    >
      <Link href={`/ps/${ps.ps_number}`} className="flex h-full flex-col">
        <CardContent
          className={
            variant === "grid"
              ? "flex flex-1 flex-col justify-between gap-4 p-5"
              : "flex flex-col gap-4 p-5 sm:flex-row sm:items-start"
          }
        >
          <div className={variant === "list" ? "flex-1 space-y-3" : "space-y-3"}>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-md border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground tracking-tight">
                {ps.ps_number}
              </span>
              <div className="flex items-center gap-2">
                <DeadlineCountdown ps={ps} />
                <div onClick={(e) => e.preventDefault()}>
                  <ShortlistButton psNumber={ps.ps_number} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="line-clamp-2 text-heading-16 text-foreground transition-colors group-hover:text-primary flex items-start justify-between gap-2">
                <span>
                  <Highlight text={title} />
                </span>
                <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </h3>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {/* Category Pill */}
                <span
                  className={
                    isSoftware
                      ? "inline-flex items-center rounded-full border border-blue-600/30 bg-blue-600/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-blue-700 dark:text-blue-600"
                      : "inline-flex items-center rounded-full border border-amber-600/30 bg-amber-600/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-amber-700 dark:text-amber-500"
                  }
                >
                  {ps.category}
                </span>

                {/* Theme Tag */}
                <Badge
                  variant="secondary"
                  className="gap-1 font-normal text-label-12 text-muted-foreground"
                >
                  <TagIcon className="size-3 text-muted-foreground/70" />
                  <span className="truncate max-w-[180px]">{ps.theme}</span>
                </Badge>

                {/* Dataset Pill */}
                {ps.dataset_link.trim() && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-green-600/30 bg-green-600/10 font-mono text-[10px] text-green-700 dark:text-green-500"
                  >
                    <DatabaseIcon className="size-3 text-green-700 dark:text-green-500" />
                    Dataset
                  </Badge>
                )}
              </div>
            </div>

            {variant === "list" ? (
              <p className="text-copy-14 text-muted-foreground">
                <Highlight text={excerpt} />
              </p>
            ) : (
              <p className="sr-only">{descriptionExcerpt(ps, 180)}</p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/60 pt-3 text-label-12 text-muted-foreground">
            <span className="flex items-center gap-1.5 truncate font-medium text-muted-foreground">
              <Building2Icon className="size-3.5 shrink-0 text-muted-foreground/70" />
              <span className="truncate">{ps.org}</span>
            </span>
            {variant === "list" && (
              <span className="shrink-0 font-mono text-[11px]">
                {ps.ideas ? `${ps.ideas} ideas` : ps.deadline}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

