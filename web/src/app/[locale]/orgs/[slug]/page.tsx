import type { Metadata } from "next";
import { Globe } from "@/components/icons/geist";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { PsCard } from "@/components/ps-card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { stats } from "@/lib/ps";
import {
  orgBySlug,
  orgPs,
  orgs,
  orgSlugs,
} from "@/lib/routes";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sih-2026-problem-statements.vercel.app";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(orgBySlug).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const name = orgBySlug[slug];
  if (!name) return {};
  const ps = orgPs(name);
  const t = await getTranslations({ locale, namespace: "landing" });
  const path = (loc: string) =>
    `${SITE_URL}${getPathname({ href: `/orgs/${slug}`, locale: loc })}`;

  return {
    title: `${name} - SIH 2026 Problem Statements (${ps.length})`,
    description: t("orgDesc", {
      count: ps.length,
      org: name,
      software: ps.filter((p) => p.category === "Software").length,
      hardware: ps.filter((p) => p.category === "Hardware").length,
    }),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((loc) => [loc, path(loc)])),
    },
  };
}

export default async function OrgPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const name = orgBySlug[slug];
  if (!name) notFound();

  const ps = orgPs(name);
  const software = ps.filter((p) => p.category === "Software").length;
  const hardware = ps.filter((p) => p.category === "Hardware").length;
  const related = orgs.filter((n) => n !== name).slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${name} - SIH 2026 Problem Statements`,
          description: t("orgDesc", {
            count: ps.length,
            org: name,
            software,
            hardware,
          }),
          url: `${SITE_URL}/${locale}/orgs/${slug}`,
          isPartOf: {
            "@type": "WebSite",
            name: "SIH 2026 Problem Statements",
          },
        }}
      />

      <Breadcrumb className="py-2 text-label-12">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={getPathname({ href: "/", locale })}>
              {t("breadcrumbAll")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6 border-b border-border/60 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
            <Globe className="size-3.5" />
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {t("breadcrumbOrgs")}
            </span>
          </Badge>
        </div>
        <h1 className="text-heading-32 sm:text-heading-40 text-foreground">
          {name}
        </h1>
        <p className="max-w-2xl text-copy-16 text-muted-foreground">
          {t("orgDesc", { count: ps.length, org: name, software, hardware })}
        </p>
        <div className="flex flex-wrap items-center gap-2.5 text-label-12 font-medium">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 font-mono text-muted-foreground">
            <strong className="font-bold text-foreground">{ps.length}</strong>{" "}
            {t("statementsCount", { count: ps.length })}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600/30 bg-blue-600/10 px-3 py-1.5 font-mono text-blue-700 dark:text-blue-600">
            <strong className="font-bold">{software}</strong> {t("software")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-600/30 bg-amber-600/10 px-3 py-1.5 font-mono text-amber-700 dark:text-amber-500">
            <strong className="font-bold">{hardware}</strong> {t("hardware")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2 xl:grid-cols-3">
        {ps.map((p) => (
          <PsCard key={p.ps_number} ps={p} />
        ))}
      </div>

      <div className="space-y-3 border-t border-border/60 py-6">
        <h2 className="text-heading-16">{t("relatedOrgs")}</h2>
        <div className="flex flex-wrap gap-2">
          {related.map((n) => (
            <Link
              key={n}
              href={getPathname({ href: `/orgs/${orgSlugs[n]}`, locale })}
            >
              <Badge
                variant="outline"
                className="cursor-pointer px-2.5 py-1 font-normal transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {n}
                <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                  {orgPs(n).length}
                </span>
              </Badge>
            </Link>
          ))}
        </div>
        <Link
          href={getPathname({ href: "/", locale })}
          className="inline-block text-label-13 font-medium text-blue-700 underline-offset-4 hover:underline dark:text-blue-600"
        >
          {t("viewAll")} ({stats.total})
        </Link>
      </div>
    </div>
  );
}
