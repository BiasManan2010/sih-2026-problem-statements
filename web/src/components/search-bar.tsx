"use client";

import {SearchIcon, XIcon, CornerDownLeftIcon, HistoryIcon} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { fuzzySearch } from "@/lib/search";
import { stats } from "@/lib/ps";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const { recent, addRecent } = useRecentSearches();
  const [query, setQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  if (prevUrlQuery !== urlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const results = useMemo(
    () => (query.trim().length >= 2 ? fuzzySearch(query, 8) : []),
    [query],
  );

  const showSuggestions = focused && open && (results.length > 0 || recent.length > 0);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const submit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    addRecent(trimmed);
    setOpen(false);
    router.push(`/?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className="relative group"
      >
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={() => setFocused(false)}
          placeholder="Search by title, theme, organization or PS number (e.g. SIH26001)…"
          className="h-12 rounded-xl border-border/80 bg-background/90 pl-11 pr-20 text-copy-16 shadow-xs backdrop-blur-md transition-all focus-visible:border-gray-500 dark:focus-visible:border-gray-500 focus-visible:ring-1 focus-visible:ring-blue-600/40"
          aria-label="Search problem statements"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Clear search"
            className="absolute top-1/2 right-12 size-6 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <kbd className="pointer-events-none absolute top-1/2 right-3.5 hidden -translate-y-1/2 items-center justify-center rounded border border-border/80 bg-muted/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-2xs sm:flex">
          ⏎
        </kbd>
      </form>

      {showSuggestions && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border/80 bg-popover/95 p-2 text-popover-foreground shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-100">
          {results.length > 0 && (
            <div className="space-y-1">
              <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Problem Statements ({results.length})
              </p>
              {results.map((ps) => (
                <button
                  key={ps.ps_number}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addRecent(query);
                    setOpen(false);
                    router.push(`/ps/${ps.ps_number}`);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-copy-14 transition-colors hover:bg-accent/80 group"
                >
                  <span className="shrink-0 rounded border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground">
                    {ps.ps_number}
                  </span>
                  <span className="truncate text-foreground font-medium group-hover:text-primary">
                    {ps.title}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">
                    {ps.theme}
                  </span>
                </button>
              ))}
            </div>
          )}
          {recent.length > 0 && (
            <div className="mt-1 space-y-1 border-t border-border/60 pt-2">
              <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Recent Searches
              </p>
              {recent.slice(0, 4).map((r) => (
                <button
                  key={r}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    submit(r);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent/80 hover:text-foreground"
                >
                  <HistoryIcon className="size-3 text-muted-foreground/70" />
                  <span className="truncate">{r}</span>
                </button>
              ))}
            </div>
          )}
          <div className="mt-1 border-t border-border/60 pt-1.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                submit(query);
              }}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <span className="flex items-center gap-2">
                <SearchIcon className="size-3.5 text-muted-foreground" />
                Search all {stats.total} statements for “{query}”
              </span>
              <CornerDownLeftIcon className="size-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

