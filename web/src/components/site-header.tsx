"use client";

import {BookmarkIcon, SearchIcon} from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-medium tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          {/* Vercel Geometric Logo Icon */}
          <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background shadow-xs transition-transform group-hover:scale-105">
            <svg
              className="size-3.5 fill-current"
              viewBox="0 0 76 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-label-16 font-semibold">SIH 2026</span>
            <span className="hidden text-label-13 text-muted-foreground sm:inline">
              Problem Statements
            </span>
          </div>
          <Badge
            variant="outline"
            className="hidden font-mono text-[10px] text-muted-foreground sm:inline-flex"
          >
            v2026.1
          </Badge>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-9 w-64 justify-between rounded-lg border-border/80 bg-muted/40 px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground md:flex"
            onClick={onOpenCommand}
          >
            <span className="flex items-center gap-2">
              <SearchIcon className="size-3.5 text-muted-foreground" />
              Search problem statements…
            </span>
            <kbd className="pointer-events-none flex h-5 select-none items-center rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-2xs">
              ⌘K
            </kbd>
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            className="md:hidden"
            aria-label="Search"
            onClick={onOpenCommand}
          >
            <SearchIcon className="size-4" />
          </Button>

          <Link href="/shortlist" aria-label="Shortlist">
            <Button
              variant="outline"
              size="sm"
              className="relative h-9 gap-1.5 rounded-lg border-border/80 px-3 text-xs font-medium"
            >
              <BookmarkIcon className="size-3.5" />
              <span className="hidden sm:inline">Shortlist</span>
              {mounted && shortlisted.size > 0 ? (
                <Badge
                  variant="default"
                  className="ml-0.5 h-4 min-w-4 rounded-full px-1.5 font-mono text-[10px] font-semibold"
                >
                  {shortlisted.size}
                </Badge>
              ) : null}
            </Button>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

