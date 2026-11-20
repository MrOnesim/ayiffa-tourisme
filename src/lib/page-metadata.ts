import type { Metadata } from "next";
import { site } from "./content";
import { getDictionary } from "./get-dictionary";
import type { Locale } from "./i18n";

type TextMeta = { title: string; description: string };

export function getPageMetadata(locale: Locale, key: string, path: string): Metadata {
  const seo = getDictionary(locale).seo as unknown as Record<string, TextMeta>;
  const item = seo[key];
  return { title: item.title, description: item.description, alternates: { canonical: path } };
}

export function getRootMetadata(locale: Locale): Metadata {
  const seo = getDictionary(locale).seo;
  return {
    metadataBase: new URL(site.url),
    title: { default: seo.home.title, template: "%s | AYIFFA TOURISME" },
    description: seo.home.description,
    applicationName: site.name,
    openGraph: {
      type: "website",
      locale: seo.ogLocale,
      siteName: site.name,
      title: seo.home.ogTitle,
      description: seo.home.ogDescription,
      images: [{ url: "/images/ganvie.jpg", width: 1880, height: 1250, alt: seo.home.ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.home.ogTitle,
      description: seo.home.twitterDescription,
      images: ["/images/ganvie.jpg"],
    },
    robots: process.env.SITE_INDEXABLE === "true" ? { index: true, follow: true } : { index: false, follow: true },
  };
}
