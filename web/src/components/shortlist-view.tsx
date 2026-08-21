"use client";

import { BookmarkIcon, DownloadIcon, FileTextIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";

import { PsCard } from "@/components/ps-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMounted } from "@/hooks/use-local-storage";
import { useShortlist } from "@/hooks/use-shortlist";
import { psMarkdown, problemStatements } from "@/lib/ps";

export function ShortlistView() {
  const { shortlisted, clear } = useShortlist();
  const mounted = useMounted();

  const items = useMemo(
    () =>
      problemStatements.filter((ps) => shortlisted.has(ps.ps_number)),
    [shortlisted],
  );

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-label-13 text-muted-foreground">
        <Spinner className="size-4" />
        Loading shortlist data…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/80 py-20 text-center bg-card/40">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-2xs">
          <BookmarkIcon className="size-6 text-muted-foreground" />
        </div>
        <p className="text-base font-semibold text-foreground">Your shortlist is empty</p>
        <p className="max-w-sm text-xs text-muted-foreground leading-relaxed">
          Browse the problem statements and tap the shortlist bookmark on any card to save it here for team evaluation.
        </p>
        <Button render={<Link href="/" />} nativeButton={false} size="sm" className="mt-2 rounded-lg gap-2">
          Browse Problem Statements
        </Button>
      </div>
    );
  }

  const exportCsv = () => {
    const header = "ps_number,title,org,category,theme,deadline\n";
    const rows = items
      .map((ps) =>
        [
          ps.ps_number,
          `"${ps.title.replace(/"/g, '""')}"`,
          `"${ps.org.replace(/"/g, '""')}"`,
          ps.category,
          `"${ps.theme.replace(/"/g, '""')}"`,
          ps.deadline,
        ].join(","),
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sih2026-shortlist.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Shortlist exported as CSV");
  };

  const copyMarkdown = async () => {
    const md = items
      .map((ps) => psMarkdown(ps))
      .join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(md);
      toast.success("Shortlist copied as Markdown");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{items.length}</span> saved {items.length === 1 ? "statement" : "statements"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            className="gap-1.5 rounded-lg border-border/80 text-xs font-medium"
          >
            <DownloadIcon className="size-3.5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyMarkdown}
            className="gap-1.5 rounded-lg border-border/80 text-xs font-medium"
          >
            <FileTextIcon className="size-3.5" />
            Copy Markdown
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="gap-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive"
          >
            <Trash2Icon className="size-3.5" />
            Clear all
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((ps) => (
          <PsCard key={ps.ps_number} ps={ps} />
        ))}
      </div>
    </div>
  );
}

