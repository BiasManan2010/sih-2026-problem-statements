"use client";

import { ListIcon, LayoutGridIcon, SlidersHorizontalIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, FilterIcon, SearchXIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { PsCard } from "@/components/ps-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useExplorer, PAGE_SIZE } from "@/hooks/use-explorer";
import { stats, problemStatements } from "@/lib/ps";
import type { FilterState, ViewMode } from "@/lib/filters";

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SearchIcon,
  RotateCcwIcon,
  ArrowUpDownIcon,
  Building2Icon,
  LayersIcon,
  DatabaseIcon,
} from "lucide-react";

function CategoryTabs({
  value,
  onChange,
}: {
  value: FilterState["categories"];
  onChange: (v: FilterState["categories"]) => void;
}) {
  const active = value.length === 0 ? "all" : value.length === 1 ? value[0] : "both";
  return (
    <Tabs
      value={active}
      onValueChange={(v) => {
        if (v === "all") onChange([]);
        else onChange([v as "Software" | "Hardware"]);
      }}
      className="w-full sm:w-auto"
    >
      <TabsList className="grid w-full grid-cols-3 rounded-xl border border-border/60 bg-muted/40 p-1 sm:w-auto">
        <TabsTrigger value="all" className="rounded-lg font-medium text-xs px-3 transition-all">
          All <span className="ml-1 font-mono text-[10px] text-muted-foreground">({stats.total})</span>
        </TabsTrigger>
        <TabsTrigger value="Software" className="rounded-lg font-medium text-xs px-3 transition-all">
          Software <span className="ml-1 font-mono text-[10px] text-muted-foreground">({stats.software})</span>
        </TabsTrigger>
        <TabsTrigger value="Hardware" className="rounded-lg font-medium text-xs px-3 transition-all">
          Hardware <span className="ml-1 font-mono text-[10px] text-muted-foreground">({stats.hardware})</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

const SORT_LABELS: Record<string, string> = {
  sno: "Statement ID (Ascending)",
  title: "Title (A–Z)",
  theme: "Theme Name",
  org: "Organization",
  deadline: "Submission Deadline",
};

function FilterControls({
  filters,
  activeCount,
  setFilter,
  toggleTheme,
  onReset,
}: {
  filters: FilterState;
  activeCount: number;
  setFilter: (k: keyof FilterState, v: FilterState[keyof FilterState]) => void;
  toggleTheme: (t: string) => void;
  onReset: () => void;
}) {
  const [themeSearch, setThemeSearch] = useState("");

  const filteredThemes = useMemo(() => {
    if (!themeSearch.trim()) return stats.themes;
    return stats.themes.filter((t) =>
      t.name.toLowerCase().includes(themeSearch.toLowerCase()),
    );
  }, [themeSearch]);

  return (
    <Card className="rounded-xl border border-border/70 bg-card/90 shadow-2xs backdrop-blur-sm">
      <CardHeader className="p-4 pb-3 border-b border-border/50">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-foreground">
          <span className="flex items-center gap-2">
            <FilterIcon className="size-4 text-primary" />
            <span>Filter Statements</span>
          </span>
          {activeCount > 0 ? (
            <div className="flex items-center gap-1.5">
              <Badge variant="default" className="font-mono text-[10px] h-4 px-1.5 rounded-md">
                {activeCount} active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
                onClick={onReset}
              >
                Reset
              </Button>
            </div>
          ) : (
            <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
              {stats.total} total
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Organization Filter */}
        <div className="space-y-2">
          <Label htmlFor="org-filter" className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Building2Icon className="size-3.5 text-muted-foreground" />
            <span>Organization</span>
          </Label>
          <Select
            value={filters.org || "all"}
            onValueChange={(v) => setFilter("org", v === "all" ? "" : (v ?? ""))}
          >
            <SelectTrigger id="org-filter" className="w-full h-9 rounded-lg border-border/70 bg-background text-xs">
              <SelectValue>
                {filters.org ? filters.org : `All organizations (${stats.orgs.length})`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-64">
              <SelectItem value="all" className="text-xs">
                All organizations ({stats.orgs.length})
              </SelectItem>
              {stats.orgs.map((o) => (
                <SelectItem key={o.name} value={o.name} className="text-xs">
                  {o.name} ({o.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-border/50" />

        {/* Themes Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <LayersIcon className="size-3.5 text-muted-foreground" />
              <span>Themes</span>
            </Label>
            {filters.themes.length > 0 && (
              <Badge variant="secondary" className="font-mono text-[10px] px-1.5">
                {filters.themes.length} selected
              </Badge>
            )}
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search themes..."
              value={themeSearch}
              onChange={(e) => setThemeSearch(e.target.value)}
              className="h-8 pl-8 text-xs rounded-md border-border/70 bg-background"
            />
          </div>

          <ScrollArea className="h-44 rounded-lg border border-border/50 bg-background/50 p-1.5">
            <div className="space-y-1">
              {filteredThemes.length === 0 ? (
                <p className="p-2 text-center text-xs text-muted-foreground">No themes found</p>
              ) : (
                filteredThemes.map((t) => {
                  const checked = filters.themes.includes(t.name);
                  return (
                    <div
                      key={t.name}
                      onClick={() => toggleTheme(t.name)}
                      className={`flex items-center justify-between gap-2 rounded-md px-2 py-1 text-xs cursor-pointer transition-colors ${
                        checked
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Checkbox
                          id={`theme-${t.name}`}
                          checked={checked}
                          onCheckedChange={() => toggleTheme(t.name)}
                          className="size-3.5"
                        />
                        <span className="truncate text-[11.5px]">{t.name}</span>
                      </div>
                      <Badge
                        variant={checked ? "default" : "outline"}
                        className="font-mono text-[10px] h-4 px-1.5 shrink-0"
                      >
                        {t.count}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        <Separator className="bg-border/50" />

        {/* Has Dataset Switch */}
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/50 p-2.5">
          <Label htmlFor="dataset-switch" className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
            <DatabaseIcon className="size-3.5 text-muted-foreground" />
            <span>Has attached dataset</span>
          </Label>
          <Switch
            id="dataset-switch"
            checked={filters.hasDataset}
            onCheckedChange={(v) => setFilter("hasDataset", v)}
          />
        </div>

        <Separator className="bg-border/50" />

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <ArrowUpDownIcon className="size-3.5 text-muted-foreground" />
            <span>Sort by</span>
          </Label>
          <Select value={filters.sort || "sno"} onValueChange={(v) => setFilter("sort", v ?? "sno")}>
            <SelectTrigger className="w-full h-9 rounded-lg border-border/70 bg-background text-xs">
              <SelectValue>
                {SORT_LABELS[filters.sort || "sno"] || "Statement ID (Ascending)"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="sno">Statement ID (Ascending)</SelectItem>
              <SelectItem value="title">Title (A–Z)</SelectItem>
              <SelectItem value="theme">Theme Name</SelectItem>
              <SelectItem value="org">Organization</SelectItem>
              <SelectItem value="deadline">Submission Deadline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        {activeCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center gap-1.5 rounded-lg border-border/70 text-xs text-muted-foreground hover:text-foreground mt-1"
            onClick={onReset}
          >
            <RotateCcwIcon className="size-3.5" />
            Reset all filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function Explorer() {
  const searchParams = useSearchParams();
  const {
    filters,
    setFilter,
    toggleTheme,
    reset,
    total,
    pageCount,
    pageItems,
    activeCount,
    urlFor,
  } = useExplorer(searchParams.toString());

  const [mobileOpen, setMobileOpen] = useState(false);

  const orgNames = useMemo(
    () => new Set(problemStatements.map((ps) => ps.org)),
    [],
  );
  const validOrg = filters.org && orgNames.has(filters.org) ? filters.org : "";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex flex-col gap-6 py-6 lg:flex-row lg:gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin pr-1">
            <FilterControls
              filters={{ ...filters, org: validOrg }}
              activeCount={activeCount}
              setFilter={setFilter}
              toggleTheme={toggleTheme}
              onReset={reset}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
            <CategoryTabs
              value={filters.categories}
              onChange={(v) => setFilter("categories", v)}
            />

            <div className="flex items-center gap-3">
              <p className="font-mono text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{total}</span> of {stats.total} statements
              </p>

              <Button
                variant="outline"
                size="sm"
                className="relative gap-1.5 lg:hidden rounded-lg border-border/80 text-xs"
                aria-label="Filters"
                onClick={() => setMobileOpen(true)}
              >
                <SlidersHorizontalIcon className="size-3.5" />
                Filters
                {activeCount > 0 && (
                  <Badge className="ml-0.5 h-4 min-w-4 rounded-full px-1 font-mono text-[10px]">
                    {activeCount}
                  </Badge>
                )}
              </Button>

              <ToggleGroup
                variant="outline"
                size="sm"
                value={[filters.view]}
                onValueChange={(v) => {
                  if (v.length > 0) setFilter("view", v[0] as ViewMode);
                }}
                aria-label="View mode"
                className="hidden rounded-lg border border-border/80 bg-muted/40 p-0.5 sm:flex"
              >
                <ToggleGroupItem value="grid" aria-label="Grid view" className="rounded-md">
                  <LayoutGridIcon className="size-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view" className="rounded-md">
                  <ListIcon className="size-3.5" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {filters.themes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Active Themes:
              </span>
              {filters.themes.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="cursor-pointer gap-1 rounded-md px-2 py-0.5 text-xs transition-colors hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => toggleTheme(t)}
                >
                  {t} <XIcon className="size-3" />
                </Badge>
              ))}
            </div>
          )}

          {pageItems.length === 0 ? (
            <Empty className="border border-dashed border-border/80 bg-card/40 py-20">
              <EmptyMedia variant="icon">
                <SearchXIcon className="size-4" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle className="text-heading-16">
                  No problem statements match your criteria
                </EmptyTitle>
                <EmptyDescription>
                  Try adjusting your search terms or clearing specific filters.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={reset}>
                  <XIcon className="size-3.5" />
                  Clear all filters
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div
              className={
                filters.view === "grid"
                  ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
                  : "space-y-3"
              }
            >
              {pageItems.map((ps) => (
                <PsCard
                  key={ps.ps_number}
                  ps={ps}
                  query={filters.q}
                  variant={filters.view}
                />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <Pagination className="py-6">
              <PaginationContent>
                {filters.page > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href={urlFor({ page: filters.page - 1 })}
                      aria-label="Previous page"
                      className="rounded-lg border border-border/80"
                    >
                      <ChevronLeftIcon className="size-4" />
                    </PaginationLink>
                  </PaginationItem>
                )}
                {Array.from({ length: pageCount }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === pageCount ||
                      Math.abs(p - filters.page) <= 1,
                  )
                  .reduce<number[]>((acc, p) => {
                    if (acc.length && p - acc[acc.length - 1] > 1) {
                      acc.push(-1);
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === -1 ? (
                      <PaginationItem key={`gap-${i}`}>
                        <span className="px-2 text-xs font-mono text-muted-foreground">…</span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href={urlFor({ page: p })}
                          isActive={p === filters.page}
                          className="rounded-lg font-mono text-xs"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                {filters.page < pageCount && (
                  <PaginationItem>
                    <PaginationLink
                      href={urlFor({ page: filters.page + 1 })}
                      aria-label="Next page"
                      className="rounded-lg border border-border/80"
                    >
                      <ChevronRightIcon className="size-4" />
                    </PaginationLink>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
          <p className="pb-4 text-center font-mono text-[11px] text-muted-foreground">
            Showing page {filters.page} of {pageCount} ({Math.min(PAGE_SIZE, Math.max(0, total - (filters.page - 1) * PAGE_SIZE))} items on this page)
          </p>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-80 border-l border-border bg-background">
          <SheetHeader>
            <SheetTitle className="font-semibold text-base">Filter Statements</SheetTitle>
            <SheetDescription className="text-xs">
              Refine Smart India Hackathon problem statements.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FilterControls
              filters={{ ...filters, org: validOrg }}
              activeCount={activeCount}
              setFilter={setFilter}
              toggleTheme={toggleTheme}
              onReset={() => {
                reset();
                setMobileOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

