import type { Locale } from "./i18n";
import fr from "./dictionaries/fr.json";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";
import de from "./dictionaries/de.json";

const dictionaries = { fr, en, es, de };

export type Dictionary = typeof fr;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.fr;
}