"use client";

import { ListIcon, LayoutGridIcon, SlidersHorizontalIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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
    >
      <TabsList>
        <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
        <TabsTrigger value="Software">Software ({stats.software})</TabsTrigger>
        <TabsTrigger value="Hardware">Hardware ({stats.hardware})</TabsTrigger>
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
    <div className="space-y-5">
      <div className="space-y-3">
        <Label htmlFor="org-filter" className="text-xs font-medium text-muted-foreground">
          Organization
        </Label>
        <Select
          value={filters.org}
          onValueChange={(v) => setFilter("org", v ?? "")}
        >
          <SelectTrigger id="org-filter" className="w-full">
            <SelectValue placeholder="All organizations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All organizations</SelectItem>
            {stats.orgs.map((o) => (
              <SelectItem key={o.name} value={o.name}>
                {o.name} ({o.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground">Themes</Label>
        <div className="flex flex-wrap gap-1.5">
          {stats.themes.map((t) => {
            const active = filters.themes.includes(t.name);
            return (
              <Badge
                key={t.name}
                variant={active ? "default" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => toggleTheme(t.name)}
              >
                {t.name} {t.count}
              </Badge>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="dataset-switch" className="text-sm">
          Only statements with datasets
        </Label>
        <Switch
          id="dataset-switch"
          checked={filters.hasDataset}
          onCheckedChange={(v) => setFilter("hasDataset", v)}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Sort by</Label>
        <Select value={filters.sort} onValueChange={(v) => setFilter("sort", v ?? "sno")}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sno">Statement number</SelectItem>
            <SelectItem value="title">Title (A–Z)</SelectItem>
            <SelectItem value="theme">Theme</SelectItem>
            <SelectItem value="org">Organization</SelectItem>
            <SelectItem value="deadline">Deadline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={onReset}>
        <XIcon className="size-4" />
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
      <div className="flex flex-col gap-4 py-6 lg:flex-row lg:gap-8">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-5 overflow-y-auto pr-2">
            <FilterControls
              filters={{ ...filters, org: validOrg }}
              setFilter={setFilter}
              toggleTheme={toggleTheme}
              onReset={reset}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryTabs
              value={filters.categories}
              onChange={(v) => setFilter("categories", v)}
            />

            <div className="ml-auto flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {total} of {stats.total} statements
              </p>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Filters"
                onClick={() => setMobileOpen(true)}
              >
                <SlidersHorizontalIcon className="size-4" />
                {activeCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px]">
                    {activeCount}
                  </Badge>
                )}
              </Button>
              <div className="hidden items-center gap-1 sm:flex">
                <Button
                  variant={filters.view === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  aria-label="Grid view"
                  onClick={() => setFilter("view", "grid")}
                >
                  <LayoutGridIcon className="size-4" />
                </Button>
                <Button
                  variant={filters.view === "list" ? "secondary" : "ghost"}
                  size="icon"
                  aria-label="List view"
                  onClick={() => setFilter("view", "list")}
                >
                  <ListIcon className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {filters.themes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Theme:</span>
              {filters.themes.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleTheme(t)}
                >
                  {t} <XIcon className="ml-1 size-3" />
                </Badge>
              ))}
            </div>
          )}

          {pageItems.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
              <p className="text-lg font-medium">No problem statements found</p>
              <p className="text-sm text-muted-foreground">
                Try a different search term or clear some filters.
              </p>
              <Button variant="outline" size="sm" className="mt-2" onClick={reset}>
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
            <Pagination className="py-4">
              <PaginationContent>
                {filters.page > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href={urlFor({ page: filters.page - 1 })}
                      aria-label="Previous page"
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
                        <span className="px-2 text-sm text-muted-foreground">…</span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href={urlFor({ page: p })}
                          isActive={p === filters.page}
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
                    >
                      <ChevronRightIcon className="size-4" />
                    </PaginationLink>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
          <p className="pb-4 text-center text-xs text-muted-foreground">
            Showing {Math.min(PAGE_SIZE, Math.max(0, total - (filters.page - 1) * PAGE_SIZE))} of {total} statements
          </p>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Refine the list of problem statements.
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
