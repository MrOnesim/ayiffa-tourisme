"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Circuit } from "@/lib/content";
import { useLocale } from "./locale-provider";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CircuitPinnedProps {
  circuits: Circuit[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CircuitPinned({ circuits }: CircuitPinnedProps) {
  const { t } = useLocale();
  const ui = t.ui;
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Cross-fade when active index changes
  useEffect(() => {
    if (activeIndex === displayIndex) return;
    setFading(true);
    const timer = setTimeout(() => {
      setDisplayIndex(activeIndex);
      setFading(false);
    }, 150); // half of 0.9s fade — swap at mid-opacity dip
    return () => clearTimeout(timer);
  }, [activeIndex, displayIndex]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // Prefer the entry with highest intersection ratio
      let best: IntersectionObserverEntry | null = null;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!best || entry.intersectionRatio > best.intersectionRatio) {
          best = entry;
        }
      }
      if (!best) return;
      const idx = itemRefs.current.findIndex((el) => el === best!.target);
      if (idx !== -1) setActiveIndex(idx);
    },
    []
  );

  useEffect(() => {
    // Respect prefers-reduced-motion — skip IntersectionObserver, stay on 0
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.4,
      rootMargin: "-10% 0px -10% 0px",
    });

    itemRefs.current.forEach((el) => {
      if (el) observerRef.current!.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleIntersection, circuits.length]);

  const active = circuits[displayIndex];

  return (
    <div className="circuit-pinned-layout">
      {/* ── Left column: scrolling items ── */}
      <div className="circuit-pinned-left">
        {circuits.map((circuit, i) => (
          <article
            key={circuit.slug}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`circuit-pinned-item${activeIndex === i ? " is-active" : ""}`}
          >
            <div className="circuit-pinned-mobile-media">
              <Image src={circuit.image} alt={circuit.alt} fill sizes="(max-width: 900px) 100vw" className="circuit-pinned-img" priority={i === 0}/>
              <span className="circuit-pinned-mobile-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="circuit-pinned-mobile-duration">{circuit.duration}</span>
            </div>
            <p className="eyebrow circuit-pinned-eyebrow">
              {circuit.duration} · {circuit.category}
            </p>
            <h3 className="circuit-pinned-title">{circuit.name}</h3>
            {circuit.subtitle && (
              <p className="circuit-pinned-subtitle">{circuit.subtitle}</p>
            )}
            <p className="circuit-pinned-desc">{circuit.description}</p>
            {circuit.highlights.length > 0 && (
              <ul className="circuit-pinned-highlights">
                {circuit.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            <Link
              href={`/circuits/${circuit.slug}`}
              className="circuit-pinned-cta"
              aria-label={`${ui.circuitPinnedCta} ${circuit.name}`}
            >
              {ui.circuitPinnedCta}
              <span aria-hidden="true" className="circuit-pinned-arrow">→</span>
            </Link>
          </article>
        ))}
      </div>

      {/* ── Right column: sticky image panel ── */}
      <div className="circuit-pinned-right">
        <div className="circuit-pinned-images" aria-hidden="true">
          {circuits.map((circuit, i) => (
            <div
              key={circuit.slug}
              className={`circuit-pinned-image${displayIndex === i && !fading ? " is-active" : ""}`}
            >
              <Image
                src={circuit.image}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="circuit-pinned-img"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Caption overlay */}
        <div className="circuit-pinned-caption">
          <p className="circuit-pinned-caption-eyebrow">
            {active.duration} · {active.location}
          </p>
          <p className="circuit-pinned-caption-name">{active.name}</p>
          <Link
            href={`/circuits/${active.slug}`}
            className="circuit-pinned-caption-link"
          >
            {ui.seeCircuit}
          </Link>
        </div>
      </div>
    </div>
  );
}
