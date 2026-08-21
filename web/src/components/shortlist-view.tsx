"use client";

import { BookmarkIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";

import { PsCard } from "@/components/ps-card";
import { Button } from "@/components/ui/button";
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
    return <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-20 text-center">
        <BookmarkIcon className="size-8 text-muted-foreground" />
        <p className="text-lg font-medium">Nothing shortlisted yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Browse the problem statements and tap the bookmark on any card to add
          it here.
        </p>
        <Button render={<Link href="/" />} className="mt-2">
          Browse statements
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "statement" : "statements"}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <DownloadIcon className="size-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={copyMarkdown}>
            Copy Markdown
          </Button>
          <Button variant="ghost" size="sm" onClick={clear}>
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
