"use client";

import Link from "next/link";
import { useLocale } from "./locale-provider";

export function Brand({ light = false }: { light?: boolean }) {
  const { t } = useLocale();
  return <Link href="/" className={`brand ${light ? "brand-light" : ""}`} aria-label={t.ui.brandHomeAria}>
    <svg className="brand-symbol" width="42" height="46" viewBox="0 0 42 46" fill="none" aria-hidden="true">
      <path d="M4 40V23a17 17 0 0 1 34 0v17H4Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 35h24M9 39h24M10 30l11-18 11 18H10Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="m17 30 4-7 4 7M21 1v4M7 7l3 3M35 7l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="21" cy="12" r="2.2" fill="currentColor"/>
    </svg>
    <span className="brand-type">AYIFFA<span>TOURISME</span></span>
  </Link>;
}

export function SunEmblem({ className = "" }: { className?: string }) {
  return <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <circle cx="32" cy="32" r="13" stroke="currentColor" strokeWidth="1"/>
    {Array.from({length: 12}, (_, i) => <path key={i} d="M32 3v9" stroke="currentColor" strokeWidth="1" transform={`rotate(${i*30} 32 32)`}/>)}
    <path d="M24 35c3-7 13-7 16 0M24 40h16" stroke="currentColor" strokeWidth="1"/>
  </svg>;
}
