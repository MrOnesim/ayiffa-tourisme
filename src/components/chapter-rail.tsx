import Link from "next/link";
import { Landmark, Route, Sun, Waves } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

/**
 * AYIFFA's own thread of route: four real stops, told with local landmarks
 * rather than generic "step 01 / step 02" wording. The visual language is a
 * stamp-on-a-line, not a copied tab bar.
 */
export function ChapterRail({ locale }: { locale: Locale }) {
  const ui = getDictionary(locale).ui;
  const chapters = [
    { key: "ouidah", label: ui.chapterOuidah, href: "/destinations/ouidah", Icon: Landmark },
    { key: "ganvie", label: ui.chapterGanvie, href: "/destinations/ganvie", Icon: Waves },
    { key: "grand-popo", label: ui.chapterGrandPopo, href: "/destinations/grand-popo", Icon: Sun },
    { key: "itinerary", label: ui.chapterItinerary, href: "/contact", Icon: Route },
  ];

  return (
    <nav className="container chapter-rail" aria-label={ui.chapterRailLabel}>
      <p className="chapter-rail-intro"><span className="chapter-rail-dot" aria-hidden="true"/>{ui.chapterRailHint}</p>
      <ol className="chapter-rail-steps">
        {chapters.map(({ key, label, href, Icon }) => (
          <li key={key}>
            <Link href={href}>
              <span className="chapter-rail-stamp"><Icon size={18} strokeWidth={1.5} aria-hidden="true"/></span>
              <span className="chapter-rail-label">{label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
