import { cookies } from "next/headers";
import type { Locale } from "./i18n";
import { defaultLocale, isLocale } from "./i18n";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("ayiffa.locale")?.value;
  if (value && isLocale(value)) return value;
  return defaultLocale;
}