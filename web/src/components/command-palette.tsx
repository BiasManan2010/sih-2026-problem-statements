"use client";

import { BookmarkIcon, CornerDownLeftIcon, FolderIcon, HistoryIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { fuzzySearch } from "@/lib/search";
import { stats } from "@/lib/ps";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { recent, addRecent } = useRecentSearches();
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => (query.trim().length >= 2 ? fuzzySearch(query, 12) : []),
    [query],
  );

  const go = (path: string) => {
    setQuery("");
    onOpenChange(false);
    router.push(path);
  };

  const search = () => {
    addRecent(query);
    go(`/?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setQuery("");
        onOpenChange(next);
      }}
    >
      <CommandInput
        placeholder="Search 226 problem statements, themes, organizations…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No problem statement found.</CommandEmpty>

        {query.trim().length >= 2 && (
          <CommandGroup heading={`Results for “${query}”`}>
            {results.map((ps) => (
              <CommandItem
                key={ps.ps_number}
                value={`${ps.ps_number} ${ps.title}`}
                onSelect={() => {
                  addRecent(query);
                  go(`/ps/${ps.ps_number}`);
                }}
              >
                <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
                  {ps.ps_number}
                </Badge>
                <span className="truncate">{ps.title}</span>
                <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                  {ps.theme}
                </span>
              </CommandItem>
            ))}
            <CommandItem value="__search_all__" onSelect={search}>
              <CornerDownLeftIcon className="size-3.5" />
              Search all 226 statements for “{query}”
            </CommandItem>
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Jump to">
          <CommandItem value="home" onSelect={() => go("/")}>
            <FolderIcon className="size-3.5" />
            All problem statements
          </CommandItem>
          <CommandItem value="shortlist" onSelect={() => go("/shortlist")}>
            <BookmarkIcon className="size-3.5" />
            My shortlist
          </CommandItem>
          {recent.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recent searches">
                {recent.map((r) => (
                  <CommandItem
                    key={r}
                    value={`recent_${r}`}
                    onSelect={() => {
                      addRecent(r);
                      go(`/?q=${encodeURIComponent(r)}`);
                    }}
                  >
                    <HistoryIcon className="size-3.5" />
                    {r}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandGroup>

        <CommandGroup heading="Browse themes">
          {stats.themes.slice(0, 8).map((theme) => (
            <CommandItem
              key={theme.name}
              value={`theme_${theme.name}`}
              onSelect={() => go(`/?theme=${encodeURIComponent(theme.name)}`)}
            >
              <span className="truncate">{theme.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {theme.count}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
