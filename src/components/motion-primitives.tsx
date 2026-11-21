"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SunEmblem } from "./brand";
import { useLocale } from "./locale-provider";

const MotionLink = motion.create(Link);

function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !motionAllowed()) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--magnetic-x", `${(event.clientX - bounds.left - bounds.width / 2) * .12}px`);
    event.currentTarget.style.setProperty("--magnetic-y", `${(event.clientY - bounds.top - bounds.height / 2) * .18}px`);
  }
  function reset(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--magnetic-x", "0px");
    event.currentTarget.style.setProperty("--magnetic-y", "0px");
  }
  return <motion.div className={`magnetic ${className}`} onPointerMove={move} onPointerLeave={reset} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}>{children}</motion.div>;
}

export function TiltFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !motionAllowed()) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    event.currentTarget.style.setProperty("--tilt-x", `${-y * 5}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${x * 5}deg`);
  }
  function reset(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }
  return <motion.div className={`tilt-frame ${className}`} onPointerMove={move} onPointerLeave={reset} whileHover={reduceMotion ? undefined : { y: -6 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>{children}</motion.div>;
}

export function MotionButtonLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return <MotionLink href={href} className={className} whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}>{children}</MotionLink>;
}

export function MotionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return <motion.article className={className} whileHover={reduceMotion ? undefined : { y: -7 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }} transition={{ type: "spring", stiffness: 280, damping: 25 }}>{children}</motion.article>;
}

export function WordReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return <span className={`word-reveal ${className}`} aria-label={text}>
    {text.split(" ").map((word, index) => <span className="word-mask" aria-hidden="true" key={`${word}-${index}`}>
      <span className="word-inner" style={{ "--word-delay": `${delay + index * 90}ms` } as CSSProperties}>{word}</span>{" "}
    </span>)}
  </span>;
}

export type CursorPreviewItem = {
  label: string;
  href: string;
  image: string;
  alt: string;
  region?: string;
};

export function CursorImagePreview({ items }: { items: CursorPreviewItem[] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  // Detect coarse pointer (touch/mobile) — disable effect
  const isCoarse = useRef(false);
  useEffect(() => {
    isCoarse.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  // The easing loop only runs while a preview is visible.
  useEffect(() => {
    if (activeIndex === null) return;
    let frame = 0;
    const tick = () => {
      const lerpFactor = reduceMotion ? 1 : 0.1;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;
      if (cardRef.current) {
        cardRef.current.style.left = `${currentPos.current.x}px`;
        cardRef.current.style.top = `${currentPos.current.y}px`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, reduceMotion]);

  function handleMouseMove(e: React.MouseEvent) {
    targetPos.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseEnter(index: number) {
    if (isCoarse.current) return;
    currentPos.current = { ...targetPos.current };
    setActiveIndex(index);
  }

  function handleMouseLeave() {
    setActiveIndex(null);
  }

  const isVisible = activeIndex !== null;
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div onMouseMove={handleMouseMove}>
      <ul className="cursor-preview-list" role="list">
        {items.map((item, i) => (
          <li key={item.href} className="cursor-preview-item">
            <Link
              href={item.href}
              className="cursor-item-link"
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="cursor-item-num">0{i + 1}</span>
              <span className="cursor-item-label">{item.label}</span>
              {item.region && <span className="cursor-item-region">{item.region}</span>}
              <span className="cursor-item-arrow" aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ul>
      <div
        ref={cardRef}
        className={`cursor-floating-card${isVisible ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {activeItem && (
          <Image
            src={activeItem.image}
            alt={activeItem.alt}
            fill
            sizes="280px"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        )}
      </div>
    </div>
  );
}

export function EmotionRibbon() {
  const { t } = useLocale();
  const ui = t.ui;
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => node.setAttribute("data-in-view", String(entry.isIntersecting)), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div className="emotion-ribbon" ref={root} data-paused={paused}>
    <p className="ribbon-caption">{ui.ribbonCaption}</p>
    <div className="ribbon-viewport" aria-hidden="true"><div className="ribbon-track">
      {[0, 1].map(copy => <div className="ribbon-copy" key={copy}><span>{ui.ribbon1}</span><SunEmblem/><em>{ui.ribbon2}</em><SunEmblem/><span>{ui.ribbon3}</span><SunEmblem/></div>)}
    </div></div>
    <button className="ribbon-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? ui.ribbonPlayAria : ui.ribbonPauseAria} aria-pressed={paused}>
      {paused ? <Play size={13}/> : <Pause size={13}/>}<span>{paused ? ui.ribbonPlayLabel : ui.ribbonPauseLabel}</span>
    </button>
  </div>;
}
