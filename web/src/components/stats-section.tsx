import { Building2Icon, CpuIcon, LayersIcon, ServerIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stats } from "@/lib/ps";

export function StatsSection() {
  return (
    <section aria-label="Statistics" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">At a glance</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <LayersIcon className="size-4" /> Total statements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ServerIcon className="size-4" /> Software
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.software}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CpuIcon className="size-4" /> Hardware
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.hardware}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2Icon className="size-4" /> Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.orgs.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top themes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.themes.slice(0, 9).map((t) => (
              <div key={t.name} className="flex items-center gap-3">
                <span className="w-44 truncate text-sm">{t.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/80"
                    style={{ width: `${(t.count / stats.themes[0].count) * 100}%` }}
                  />
                </div>
                <Badge variant="outline" className="w-10 justify-center font-mono text-xs">
                  {t.count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top organizations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.orgs.slice(0, 9).map((o) => (
              <div key={o.name} className="flex items-center gap-3">
                <span className="w-44 truncate text-sm">{o.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/60"
                    style={{ width: `${(o.count / stats.orgs[0].count) * 100}%` }}
                  />
                </div>
                <Badge variant="outline" className="w-10 justify-center font-mono text-xs">
                  {o.count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
