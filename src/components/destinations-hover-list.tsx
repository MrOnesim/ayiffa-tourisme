"use client";

import { CursorImagePreview, type CursorPreviewItem } from "@/components/motion-primitives";
import { useContent } from "@/lib/use-content";
import Link from "next/link";

export function DestinationsHoverList() {
  // Localized names, regions and image descriptions come from useContent().
  const { destinations } = useContent();
  const items: CursorPreviewItem[] = destinations.map((d) => ({
    label: d.name,
    href: `/destinations/${d.slug}`,
    image: d.image,
    alt: d.imageAlt,
    region: d.region,
  }));

  return (
    <div className="destinations-hover-wrapper">
      {/* Desktop: magnetic hover preview list */}
      <div className="destinations-hover-desktop" aria-hidden={false}>
        <CursorImagePreview items={items} />
      </div>
      {/* Mobile fallback: simple link list */}
      <ul className="destinations-hover-mobile" role="list">
        {destinations.map((d) => (
          <li key={d.slug}>
            <Link href={`/destinations/${d.slug}`} className="destinations-mobile-link">
              <span>{d.name}</span>
              {d.region && <span className="destinations-mobile-region">{d.region}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
