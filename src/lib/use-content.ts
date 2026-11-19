"use client";

import { useLocale } from "@/components/locale-provider";
import { getLocalizedContent } from "@/lib/content-locales";

export function useContent() {
  const { locale } = useLocale();
  return getLocalizedContent(locale);
}