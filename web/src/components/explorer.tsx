"use client";

import { ListIcon, LayoutGridIcon, SlidersHorizontalIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, FilterIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { PsCard } from "@/components/ps-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { FilterState } from "@/lib/filters";

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
      <TabsList className="grid w-full grid-cols-3 rounded-lg border border-border/80 bg-muted/50 p-1 sm:w-auto">
        <TabsTrigger value="all" className="rounded-md font-medium text-xs">
          All ({stats.total})
        </TabsTrigger>
        <TabsTrigger value="Software" className="rounded-md font-medium text-xs">
          Software ({stats.software})
        </TabsTrigger>
        <TabsTrigger value="Hardware" className="rounded-md font-medium text-xs">
          Hardware ({stats.hardware})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function FilterControls({
  filters,
  setFilter,
  toggleTheme,
  onReset,
}: {
  filters: FilterState;
  setFilter: (k: keyof FilterState, v: FilterState[keyof FilterState]) => void;
  toggleTheme: (t: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <Label htmlFor="org-filter" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Organization
        </Label>
        <Select
          value={filters.org}
          onValueChange={(v) => setFilter("org", v ?? "")}
        >
          <SelectTrigger id="org-filter" className="w-full rounded-lg border-border/80 bg-background/80 text-xs">
            <SelectValue placeholder="All organizations" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="">All organizations ({stats.orgs.length})</SelectItem>
            {stats.orgs.map((o) => (
              <SelectItem key={o.name} value={o.name} className="text-xs">
                {o.name} ({o.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2.5">
        <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Themes ({stats.themes.length})
        </Label>
        <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
          {stats.themes.map((t) => {
            const active = filters.themes.includes(t.name);
            return (
              <Badge
                key={t.name}
                variant={active ? "default" : "outline"}
                className={`cursor-pointer select-none rounded-md px-2 py-0.5 text-xs font-normal transition-all ${
                  active
                    ? "bg-foreground text-background"
                    : "border-border/80 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => toggleTheme(t.name)}
              >
                {t.name} <span className="ml-1 font-mono text-[10px] opacity-70">{t.count}</span>
              </Badge>
            );
          })}
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="dataset-switch" className="text-xs font-medium cursor-pointer">
          Has attached dataset
        </Label>
        <Switch
          id="dataset-switch"
          checked={filters.hasDataset}
          onCheckedChange={(v) => setFilter("hasDataset", v)}
        />
      </div>

      <Separator className="bg-border/60" />

      <div className="space-y-2.5">
        <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Sort by
        </Label>
        <Select value={filters.sort} onValueChange={(v) => setFilter("sort", v ?? "sno")}>
          <SelectTrigger className="w-full rounded-lg border-border/80 bg-background/80 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sno">Statement ID (Ascending)</SelectItem>
            <SelectItem value="title">Title (A–Z)</SelectItem>
            <SelectItem value="theme">Theme Name</SelectItem>
            <SelectItem value="org">Organization</SelectItem>
            <SelectItem value="deadline">Submission Deadline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full justify-center gap-1.5 rounded-lg border-border/80 text-xs text-muted-foreground hover:text-foreground"
        onClick={onReset}
      >
        <XIcon className="size-3.5" />
        Reset all filters
      </Button>
    </div>
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
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-5 overflow-y-auto pr-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <FilterIcon className="size-4 text-muted-foreground" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                Filter Statements
              </span>
              {activeCount > 0 && (
                <Badge variant="default" className="ml-auto h-4 px-1.5 font-mono text-[10px]">
                  {activeCount} active
                </Badge>
              )}
            </div>
            <FilterControls
              filters={{ ...filters, org: validOrg }}
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

              <div className="hidden items-center rounded-lg border border-border/80 bg-muted/40 p-0.5 sm:flex">
                <Button
                  variant={filters.view === "grid" ? "secondary" : "ghost"}
                  size="icon-xs"
                  aria-label="Grid view"
                  className="rounded-md"
                  onClick={() => setFilter("view", "grid")}
                >
                  <LayoutGridIcon className="size-3.5" />
                </Button>
                <Button
                  variant={filters.view === "list" ? "secondary" : "ghost"}
                  size="icon-xs"
                  aria-label="List view"
                  className="rounded-md"
                  onClick={() => setFilter("view", "list")}
                >
                  <ListIcon className="size-3.5" />
                </Button>
              </div>
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
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/80 py-20 text-center bg-card/40">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <XIcon className="size-5" />
              </div>
              <p className="text-base font-semibold text-foreground">No problem statements match criteria</p>
              <p className="max-w-md text-xs text-muted-foreground">
                Try adjusting your search terms or clearing specific filters.
              </p>
              <Button variant="outline" size="sm" className="mt-2 rounded-lg" onClick={reset}>
                Clear all filters
              </Button>
            </div>
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

