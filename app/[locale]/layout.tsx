import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { localeAlternates, openGraphLocale } from "@/lib/i18n/metadata";
import { locales } from "@/lib/i18n/config";
import "../globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const ogImage = {
  url: "/brand/mvpcompanion-logo-compact.png",
  width: 2119,
  height: 430,
  alt: "MVPCompanion — Turn Ideas into Meaningful Products",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { site } = await getDictionary();

  return {
    metadataBase: new URL(site.domain),
    title: {
      default: site.title,
      template: "%s | MVPCompanion",
    },
    description: site.description,
    alternates: localeAlternates("/", locale),
    openGraph: {
      title: site.title,
      description: site.description,
      url: site.domain,
      siteName: site.name,
      type: "website",
      locale: openGraphLocale(locale),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [ogImage.url],
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const { ui } = await getDictionary();

  return (
    <html id="top" lang={locale} className={plusJakarta.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          {ui.chrome.skipToContent}
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
