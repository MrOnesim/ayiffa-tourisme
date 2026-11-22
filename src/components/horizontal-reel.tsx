"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLocale } from "./locale-provider";

interface ReelSlide {
  src: string;
  alt: string;
  caption: string;
}

function padNum(n: number) {
  return String(n).padStart(2, "0");
}

export function HorizontalReel() {
  const { t } = useLocale();
  const ui = t.ui;

  // Les légendes et textes alternatifs sont ceux du dictionnaire localisé.
  const slides: ReelSlide[] = [
    { src: "/images/deux voi vu du ciel.jpeg",    alt: ui.galleryAlt3, caption: ui.galleryPlace3 },
    { src: "/images/ville ouidah vu du ciel.jpeg", alt: ui.galleryAlt1, caption: ui.galleryPlace1 },
    { src: "/images/ville ganvie (1).jpeg",        alt: ui.galleryAlt7, caption: ui.galleryPlace7 },
    { src: "/images/Grand popo.jpeg",              alt: ui.galleryAlt5, caption: ui.galleryPlace5 },
    { src: "/images/ganvie vu du ciel.jpeg",       alt: ui.galleryAlt2, caption: ui.galleryPlace2 },
  ];
  const N = slides.length;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused]           = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  /* Detect prefers-reduced-motion on mount */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleScroll = useCallback(() => {
    if (paused) return;
    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    const rect        = wrapper.getBoundingClientRect();
    const reelTop     = window.scrollY + rect.top;
    const stickyHeight = stickyRef.current?.clientHeight || window.innerHeight;
    const distance    = Math.max(1, wrapper.offsetHeight - stickyHeight);
    const progress    = Math.max(0, Math.min(1, (window.scrollY - reelTop) / distance));

    /* Percentages are relative to the track itself, so scrollbars cannot shift it. */
    track.style.transform = `translateX(-${(progress * (N - 1) / N) * 100}%)`;

    const bar = wrapper.querySelector<HTMLElement>(".reel-progress-bar");
    if (bar) bar.style.transform = `scaleX(${progress})`;
    wrapper.style.setProperty("--reel-progress", String(progress));

    /* active slide index */
    setActiveIndex(Math.min(Math.round(progress * (N - 1)), N - 1));
  }, [paused, N]);

  useEffect(() => {
    if (reducedMotion) return;

    const onScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    handleScroll(); // initial call
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, reducedMotion]);

  /* Keyboard users get real slide navigation instead of only mouse-wheel scrolling. */
  const goToSlide = useCallback((next: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const reelTop = window.scrollY + rect.top;
    const stickyHeight = stickyRef.current?.clientHeight || window.innerHeight;
    const distance = Math.max(1, wrapper.offsetHeight - stickyHeight);
    const target = reelTop + (next / (N - 1)) * distance;
    setPaused(false);
    requestAnimationFrame(() => {
      window.scrollTo({ top: target, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }, [N, reducedMotion]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const targets: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft:  activeIndex - 1,
      Home: 0,
      End: N - 1,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    goToSlide(Math.max(0, Math.min(N - 1, next)));
  }

  /* ───── Reduced-motion: grid layout ───── */
  if (reducedMotion) {
    return (
      <section className="reel-reduced-grid" aria-label={ui.galleryAria}>
        {slides.map((slide, i) => (
          <figure key={i} className="reel-reduced-item">
            <Image src={slide.src} alt={slide.alt} fill sizes="(max-width:900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            <figcaption className="reel-slide-caption">{slide.caption}</figcaption>
          </figure>
        ))}
      </section>
    );
  }

  return (
    <section className="reel-section" aria-label={ui.reelAria}>
      {/* ── Sticky scroll-driven reel (desktop) ── */}
      <div
        ref={wrapperRef}
        className="reel-wrapper reel-desktop"
        style={{ height: `${N * 100}svh` }}
      >
        <div
          ref={stickyRef}
          className="reel-sticky"
          role="group"
          tabIndex={0}
          aria-label={ui.reelKeyboard}
          onKeyDown={onKeyDown}
        >
          <div className="reel-atmosphere" aria-hidden="true">
            <span className="reel-vignette"/>
            <span className="reel-grain"/>
          </div>
          <div
            ref={trackRef}
            className="reel-track"
            style={{ width: `${N * 100}vw` }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="reel-slide" aria-hidden={i !== activeIndex}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 900px) 50vw, 100vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="reel-slide-caption">
                  <span className="reel-caption-rule" aria-hidden="true"/>
                  <p className="reel-caption-label">{slide.caption}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="reel-hint" aria-hidden="true">{ui.journeyScroll}</p>

          {/* Counter */}
          <div className="reel-counter" aria-live="polite" aria-atomic="true">
            <span className="reel-counter-current">{padNum(activeIndex + 1)}</span>
            <span className="reel-counter-sep"> / </span>
            <span className="reel-counter-total">{padNum(N)}</span>
          </div>

          {/* Amber progress bar */}
          <div className="reel-progress-bar" aria-hidden="true" />

          {/* Pause / Play (accessibility) */}
          <button
            type="button"
            className="reel-pause-btn"
            aria-label={paused ? ui.reelPlay : ui.reelPause}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5,3 19,12 5,21"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Native scroll-snap carousel (mobile) ── */}
      <section className="reel-mobile" aria-label={ui.galleryAria}>
        {slides.map((slide, i) => (
          <div key={i} className="reel-mobile-slide">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
            <div className="reel-slide-caption">
              <span className="reel-caption-rule" aria-hidden="true"/>
              <p className="reel-caption-label">{slide.caption}</p>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
