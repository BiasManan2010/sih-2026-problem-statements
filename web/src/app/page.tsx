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

      <section className="relative overflow-hidden border-b border-border/60 bg-radial-glow py-16 sm:py-24">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 text-center sm:px-6">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3.5 py-1 text-label-12 font-medium text-muted-foreground shadow-2xs backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-green-600" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-foreground">
              SIH 2026 Official Database
            </span>
            <span className="text-border">|</span>
            <span className="text-muted-foreground">All 226 Statements</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-heading-40 sm:text-heading-56 text-balance bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              Smart India Hackathon 2026 Problem Statements
            </h1>
            <p className="mx-auto max-w-2xl text-copy-18 text-muted-foreground">
              Explore, filter, search and shortlist all{" "}
              <strong className="text-foreground">{stats.total} problem statements</strong>{" "}
              — {stats.software} software and {stats.hardware} hardware challenges — with fast keyboard search and instant insights.
            </p>
          </div>

          {/* SearchBar */}
          <Suspense
            fallback={
              <div className="h-12 w-full max-w-2xl rounded-full bg-muted/50 animate-pulse" />
            }
          >
            <SearchBar />
          </Suspense>

          {/* Stat Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-label-12 font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 font-mono text-muted-foreground backdrop-blur-xs shadow-2xs">
              <LayersIcon className="size-3.5 text-gray-700 dark:text-gray-500" />
              <strong className="font-bold text-foreground">{stats.total}</strong> total
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 font-mono text-muted-foreground backdrop-blur-xs shadow-2xs">
              <ServerIcon className="size-3.5 text-blue-700 dark:text-blue-600" />
              <strong className="font-bold text-foreground">{stats.software}</strong> software
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 font-mono text-muted-foreground backdrop-blur-xs shadow-2xs">
              <CpuIcon className="size-3.5 text-amber-700 dark:text-amber-500" />
              <strong className="font-bold text-foreground">{stats.hardware}</strong> hardware
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 font-mono text-muted-foreground backdrop-blur-xs shadow-2xs">
              <Building2Icon className="size-3.5 text-purple-700 dark:text-purple-500" />
              <strong className="font-bold text-foreground">{stats.orgs.length}</strong> organizations
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
              <Skeleton key={i} className="h-48 rounded-xl border border-border" />
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

