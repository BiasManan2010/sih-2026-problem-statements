import type { Metadata } from "next";
import { Building2Icon, CpuIcon, LayersIcon, ServerIcon } from "lucide-react";
import { Suspense } from "react";

import { Explorer } from "@/components/explorer";
import { FreshnessBanner } from "@/components/freshness-banner";
import { JsonLd } from "@/components/json-ld";
import { SearchBar } from "@/components/search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsSection } from "@/components/stats-section";
import { stats } from "@/lib/ps";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "SIH 2026 Problem Statements",
          description:
            "All 226 Smart India Hackathon 2026 problem statements with titles, descriptions, organizations, themes and deadlines.",
          url: "https://sih-2026-problem-statements.vercel.app",
          creator: {
            "@type": "Organization",
            name: "Smart India Hackathon",
            url: "https://sih.gov.in",
          },
          license: "https://creativecommons.org/licenses/by/4.0/",
          distribution: [
            {
              "@type": "DataDownload",
              encodingFormat: "application/json",
              contentUrl:
                "https://github.com/vedantchalke36/sih-2026-problem-statements/blob/main/data/sih2026_ps.json",
            },
            {
              "@type": "DataDownload",
              encodingFormat: "text/csv",
              contentUrl:
                "https://github.com/vedantchalke36/sih-2026-problem-statements/blob/main/data/sih2026_ps.csv",
            },
          ],
          variableMeasured: [
            "ps_number",
            "title",
            "description",
            "organization",
            "category",
            "theme",
            "deadline",
          ],
        }}
      />

      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-12 text-center sm:px-6 sm:py-16">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              SIH 2026 Problem Statements
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              All {stats.total} problem statements from Smart India Hackathon
              2026 — {stats.software} software and {stats.hardware} hardware —
              searchable, filterable and shortlistable in one place.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="h-12 w-full max-w-2xl rounded-full bg-muted" />
            }
          >
            <SearchBar />
          </Suspense>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1">
              <LayersIcon className="size-3.5 text-muted-foreground" />
              <strong>{stats.total}</strong> total
            </span>
            <span className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1">
              <ServerIcon className="size-3.5 text-muted-foreground" />
              <strong>{stats.software}</strong> software
            </span>
            <span className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1">
              <CpuIcon className="size-3.5 text-muted-foreground" />
              <strong>{stats.hardware}</strong> hardware
            </span>
            <span className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1">
              <Building2Icon className="size-3.5 text-muted-foreground" />
              <strong>{stats.orgs.length}</strong> organizations
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
        <FreshnessBanner />
      </div>

      <Suspense
        fallback={
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        }
      >
        <Explorer />
      </Suspense>

      <StatsSection />
    </>
  );
}
