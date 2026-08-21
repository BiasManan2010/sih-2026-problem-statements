import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { stats } from "@/lib/ps";
import { orgPs, orgs, orgSlugs } from "@/lib/routes";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sih2026.vuce.in";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  const path = (loc: string) =>
    `${SITE_URL}${getPathname({ href: "/orgs", locale: loc })}`;

  return {
    title: `${t("breadcrumbOrgs")} - SIH 2026 Problem Statements`,
    description: t("orgsIndexDesc", { count: orgs.length }),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((loc) => [loc, path(loc)])),
    },
  };
}

export default async function OrgsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="space-y-3 border-b border-border/60 pb-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {stats.orgs.length} · SIH 2026
        </p>
        <h1 className="text-heading-32 sm:text-heading-40 text-foreground">
          {t("breadcrumbOrgs")}
        </h1>
        <p className="max-w-2xl text-copy-16 text-muted-foreground">
          {t("orgsIndexDesc", { count: orgs.length })}
        </p>
      </div>

      <div className="grid gap-2.5 py-6 sm:grid-cols-2 lg:grid-cols-3">
        {orgs.map((name) => {
          const count = orgPs(name).length;
          return (
            <Link
              key={name}
              href={getPathname({ href: `/orgs/${orgSlugs[name]}`, locale })}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/80 px-4 py-3 transition-all hover:border-gray-500 dark:hover:border-gray-500 hover:shadow-md"
            >
              <span className="text-label-14 font-medium text-foreground group-hover:text-primary">
                {name}
              </span>
              <Badge variant="outline" className="font-mono text-[10px] shrink-0">
                {count}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
