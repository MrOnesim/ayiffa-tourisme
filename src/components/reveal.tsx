"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0, variant = "rise" }: { children: ReactNode; className?: string; delay?: number; variant?: "rise" | "image" | "soft" }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || node.getBoundingClientRect().top < window.innerHeight - 20) {
      node.classList.add("is-visible");
      return;
    }
    node.classList.add("reveal-ready");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add("is-visible"); observer.disconnect(); }
    }, { threshold: .06, rootMargin: "0px 0px -18px 0px" });
    const onPreferenceChange = () => { if (reduced.matches) { node.classList.add("is-visible"); observer.disconnect(); } };
    observer.observe(node);
    reduced.addEventListener("change", onPreferenceChange);
    return () => { observer.disconnect(); reduced.removeEventListener("change", onPreferenceChange); };
  }, []);
  return <div ref={element} className={`reveal reveal-${variant} ${className}`} style={{ "--reveal-delay": `${delay}ms`, transitionDelay: `${delay}ms` } as CSSProperties}>{children}</div>;
}
