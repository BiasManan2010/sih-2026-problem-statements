import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { problemStatements } from "@/lib/ps";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sih-2026-problem-statements.vercel.app";

function altLinks(path: string): MetadataRoute.Sitemap[number]["alternates"] {
  return {
    languages: {
      "x-default": `${SITE_URL}/en${path}`,
      ...Object.fromEntries(
        routing.locales.map((loc) => [loc, `${SITE_URL}/${loc}${path}`]),
      ),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of ["", "/shortlist"]) {
    for (const loc of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${loc}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "monthly",
        priority: path === "" ? 1 : 0.3,
        alternates: altLinks(path),
      });
    }
  }

  for (const ps of problemStatements) {
    for (const loc of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${loc}/ps/${ps.ps_number}`,
        lastModified: ps.scraped_at,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: altLinks(`/ps/${ps.ps_number}`),
      });
    }
  }

  return entries;
}
