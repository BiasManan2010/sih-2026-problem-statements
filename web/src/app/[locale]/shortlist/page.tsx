import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ShortlistView } from "@/components/shortlist-view";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sih2026.vuce.in";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shortlist" });
  const url = (loc: string) =>
    `${SITE_URL}${getPathname({ href: "/shortlist", locale: loc })}`;

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: url(locale),
      languages: Object.fromEntries(routing.locales.map((loc) => [loc, url(loc)])),
    },
  };
}

export default async function ShortlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shortlist");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="space-y-2 py-4">
        <h1 className="text-heading-32 sm:text-heading-40">{t("title")}</h1>
        <p className="text-copy-14 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <ShortlistView />
    </div>
  );
}
