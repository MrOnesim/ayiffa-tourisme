import { ArrowDownRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

/**
 * A four-step compass that turns the home page into a guided journey.
 * It borrows the "chapter" logic of tourism portals but keeps AYIFFA's own
 * wording, order and visual language — no layout or copy is duplicated.
 */
export function ChapterRail({ locale }: { locale: Locale }) {
  const ui = getDictionary(locale).ui;
  const chapters = [
    { number: "01", label: ui.chapterRepere, href: "#atlas-vivant" },
    { number: "02", label: ui.chapterChoisisse, href: "#decouvrir" },
    { number: "03", label: ui.chapterVive, href: "#vivre-le-benin" },
    { number: "04", label: ui.chapterParte, href: "#circuits" },
  ];

  return (
    <nav className="container chapter-rail" aria-label={ui.chapterRailLabel}>
      <p className="chapter-rail-intro"><span className="chapter-rail-dot" aria-hidden="true"/>{ui.chapterRailHint}</p>
      <ol className="chapter-rail-steps">
        {chapters.map(chapter => (
          <li key={chapter.number}>
            <a href={chapter.href}>
              <span className="chapter-rail-number" aria-hidden="true">{chapter.number}</span>
              <span className="chapter-rail-label">{chapter.label}</span>
              <ArrowDownRight size={15} strokeWidth={1.5} aria-hidden="true"/>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
