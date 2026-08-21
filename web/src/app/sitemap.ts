import type { MetadataRoute } from "next";

import { problemStatements } from "@/lib/ps";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sih-2026-problem-statements.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const psEntries: MetadataRoute.Sitemap = problemStatements.map((ps) => ({
    url: `${SITE_URL}/ps/${ps.ps_number}`,
    lastModified: ps.scraped_at,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/shortlist`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...psEntries,
  ];
}
