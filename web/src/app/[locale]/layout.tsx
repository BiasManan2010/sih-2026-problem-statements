import { Geist, Geist_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CommandPaletteProvider } from "@/components/command-palette-provider";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sih2026.vuce.in",
  ),
  title: {
    default: "SIH 2026 Problem Statements - Browse All 226",
    template: "%s | SIH 2026 Problem Statements",
  },
  description:
    "Search, filter and shortlist all 226 Smart India Hackathon 2026 problem statements. Filter by theme, category, organization and dataset availability.",
  keywords: [
    "SIH 2026",
    "Smart India Hackathon",
    "problem statements",
    "hackathon",
    "SIH26001",
    "government problem statements",
  ],
  authors: [{ name: "Vedant Chalke" }],
  openGraph: {
    type: "website",
    siteName: "SIH 2026 Problem Statements",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <GoogleAnalytics />
      </head>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <CommandPaletteProvider>
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </CommandPaletteProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
