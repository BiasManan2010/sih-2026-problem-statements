"use client";

import { SearchIcon, XIcon, CornerDownLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
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
        className="relative"
      >
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
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
          placeholder="Search by title, theme, organization or PS number…"
          className="h-12 rounded-full pl-11 pr-16 text-base shadow-sm"
          aria-label="Search problem statements"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Clear search"
            className="absolute top-1/2 right-10 size-6 -translate-y-1/2"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
          >
            <XIcon className="size-4" />
          </Button>
        )}
        <kbd className="absolute top-1/2 right-4 hidden -translate-y-1/2 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] sm:flex">
          ⏎
        </kbd>
      </form>

      {showSuggestions && (
        <div className="absolute top-full z-30 mt-2 w-full overflow-hidden rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-lg">
          {results.length > 0 && (
            <div className="space-y-0.5">
              <p className="px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                Problem statements
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
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-accent"
                >
                  <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
                    {ps.ps_number}
                  </Badge>
                  <span className="truncate">{ps.title}</span>
                  <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                    {ps.theme}
                  </span>
                </button>
              ))}
            </div>
          )}
          {recent.length > 0 && (
            <div className="space-y-0.5 border-t pt-1.5">
              <p className="px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                Recent searches
              </p>
              {recent.slice(0, 4).map((r) => (
                <button
                  key={r}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    submit(r);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <CornerDownLeftIcon className="size-3.5" />
                  {r}
                </button>
              ))}
            </div>
          )}
          <div className="border-t pt-1">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                submit(query);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium hover:bg-accent"
            >
              <SearchIcon className="size-3.5" />
              Search all {stats.total} statements for “{query}”
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
