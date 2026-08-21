import type { Metadata } from "next";

import { ShortlistView } from "@/components/shortlist-view";

export const metadata: Metadata = {
  title: "My Shortlist",
  description:
    "Your saved SIH 2026 problem statements, stored privately in your browser.",
  alternates: { canonical: "/shortlist" },
};

export default function ShortlistPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="space-y-2 py-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My shortlist
        </h1>
        <p className="text-sm text-muted-foreground">
          Saved statements are stored only in your browser. Use this to pick
          your team&apos;s final candidates before the deadline.
        </p>
      </div>
      <ShortlistView />
    </div>
  );
}
