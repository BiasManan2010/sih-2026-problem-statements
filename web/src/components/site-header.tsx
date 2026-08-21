"use client";

import { BookmarkIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useShortlist } from "@/hooks/use-shortlist";
import { useMounted } from "@/hooks/use-local-storage";

export function SiteHeader({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { shortlisted } = useShortlist();
  const mounted = useMounted();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            SIH
          </span>
          <span className="hidden sm:inline">Problem Statements 2026</span>
          <span className="sm:hidden">SIH 2026</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden w-64 justify-between text-muted-foreground md:flex"
            onClick={onOpenCommand}
          >
            <span className="flex items-center gap-2">
              <SearchIcon className="size-3.5" />
              Search…
            </span>
            <kbd className="pointer-events-none rounded border bg-muted px-1.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Search"
            onClick={onOpenCommand}
          >
            <SearchIcon className="size-4" />
          </Button>
          <Link href="/shortlist" aria-label="Shortlist">
            <Button variant="outline" size="icon" className="relative">
              <BookmarkIcon className="size-4" />
              {mounted && shortlisted.size > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px]">
                  {shortlisted.size}
                </Badge>
              )}
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
