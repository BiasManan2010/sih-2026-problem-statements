import type { Metadata } from "next";
import {
  Building2Icon,
  CalendarIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  TagIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeadlineCountdown } from "@/components/deadline-countdown";
import { Description } from "@/components/description";
import { JsonLd } from "@/components/json-ld";
import { NotesDialog } from "@/components/notes-dialog";
import { PsCard } from "@/components/ps-card";
import { ShareMenu } from "@/components/share-menu";
import { ShortlistButton } from "@/components/shortlist-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PS_BY_NUMBER,
  problemStatements,
  descriptionExcerpt,
  type ProblemStatement,
} from "@/lib/ps";

interface Props {
  params: Promise<{ id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sih-2026-problem-statements.vercel.app";

export const dynamicParams = false;

export function generateStaticParams() {
  return problemStatements.map((ps) => ({ id: ps.ps_number }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ps = PS_BY_NUMBER.get(id);
  if (!ps) return {};
  const title = `${ps.ps_number} · ${ps.title}`;
  return {
    title,
    description: descriptionExcerpt(ps, 160),
    alternates: { canonical: `/ps/${ps.ps_number}` },
    openGraph: {
      title,
      description: descriptionExcerpt(ps, 200),
      url: `/ps/${ps.ps_number}`,
      type: "article",
    },
  };
}

function similarStatements(ps: ProblemStatement): ProblemStatement[] {
  const sameTheme = problemStatements.filter(
    (p) => p.ps_number !== ps.ps_number && p.theme === ps.theme,
  );
  const sameOrg = problemStatements.filter(
    (p) => p.ps_number !== ps.ps_number && p.org === ps.org,
  );
  const seen = new Set<string>();
  const out: ProblemStatement[] = [];
  for (const p of [...sameTheme, ...sameOrg]) {
    if (out.length >= 6) break;
    if (seen.has(p.ps_number)) continue;
    seen.add(p.ps_number);
    out.push(p);
  }
  return out;
}

export default async function PsPage({ params }: Props) {
  const { id } = await params;
  const ps = PS_BY_NUMBER.get(id);
  if (!ps) notFound();

  const index = problemStatements.findIndex((p) => p.ps_number === ps.ps_number);
  const prev = index > 0 ? problemStatements[index - 1] : null;
  const next = index < problemStatements.length - 1 ? problemStatements[index + 1] : null;
  const similar = similarStatements(ps);

  const meta = [
    { label: "Organization", value: ps.org },
    { label: "Department", value: ps.department },
    { label: "Category", value: ps.category },
    { label: "Theme", value: ps.theme },
    { label: "Deadline", value: ps.deadline },
    { label: "Submitted ideas", value: ps.ideas },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${ps.ps_number} - ${ps.title}`,
          description: descriptionExcerpt(ps, 200),
          url: `${SITE_URL}/ps/${ps.ps_number}`,
          isPartOf: {
            "@type": "WebSite",
            name: "SIH 2026 Problem Statements",
          },
          mainEntity: {
            "@type": "CreativeWork",
            name: ps.title,
            identifier: ps.ps_number,
            creator: { "@type": "Organization", name: ps.org },
            about: ps.theme,
            datePublished: ps.scraped_at,
          },
        }}
      />

      <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          All statements
        </Link>
        <span>/</span>
        <span>{ps.theme}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 py-4">
        <div className="max-w-3xl space-y-3">
          <Badge variant="outline" className="font-mono">
            {ps.ps_number}
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {ps.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={ps.category === "Software" ? "default" : "secondary"}>
              {ps.category}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <TagIcon className="size-3" />
              {ps.theme}
            </Badge>
            <DeadlineCountdown ps={ps} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShortlistButton psNumber={ps.ps_number} variant="outline" size="sm" />
          <ShareMenu ps={ps} />
          <NotesDialog psNumber={ps.ps_number} title={ps.title} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-5">
              <h2 className="text-sm font-semibold">Details</h2>
              {meta.map((m) => (
                <div key={m.label} className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-sm font-medium">{m.value || "N/A"}</p>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  render={
                    <a
                      href={`https://sih.gov.in/sih2026PS`}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <ExternalLinkIcon className="size-4" />
                  Open on sih.gov.in
                </Button>
                {ps.dataset_link.trim() && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    render={
                      <a
                        href={ps.dataset_link.trim().split(/\s+/)[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <DatabaseIcon className="size-4" />
                    View dataset
                  </Button>
                )}
                {ps.contact.trim() && (
                  <p className="text-xs text-muted-foreground">
                    Contact: {ps.contact}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {prev && next && (
            <Card>
              <CardContent className="space-y-2 p-5">
                <h2 className="text-sm font-semibold">Navigate</h2>
                <div className="grid grid-cols-2 gap-2">
                  {prev ? (
                    <Link href={`/ps/${prev.ps_number}`}>
                      <Button variant="ghost" size="sm" className="h-auto w-full flex-col items-start gap-0.5 px-3 py-2">
                        <span className="text-[10px] text-muted-foreground">← Previous</span>
                        <span className="line-clamp-1 text-xs font-medium">{prev.ps_number}</span>
                      </Button>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <Link href={`/ps/${next.ps_number}`}>
                      <Button variant="ghost" size="sm" className="h-auto w-full flex-col items-end gap-0.5 px-3 py-2">
                        <span className="text-[10px] text-muted-foreground">Next →</span>
                        <span className="line-clamp-1 text-xs font-medium">{next.ps_number}</span>
                      </Button>
                    </Link>
                  ) : (
                    <span />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Description</h2>
              <Description text={ps.description} />
            </CardContent>
          </Card>

          {similar.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Similar problem statements
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  same theme or organization
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {similar.map((p) => (
                  <PsCard key={p.ps_number} ps={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-10 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Building2Icon className="size-3.5" />
        {ps.org} · {ps.category} · Deadline {ps.deadline}
        <CalendarIcon className="ml-2 size-3.5" />
      </p>
    </div>
  );
}
