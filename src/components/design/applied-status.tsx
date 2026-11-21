"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { appliedIdentity } from "@/lib/applied-identity";
import { useLocale } from "@/components/locale-provider";
import { getLocalizedDesignDirections } from "@/lib/design-directions-locales";

export function AppliedIdentityStatus() {
  const { locale, t } = useLocale();
  const direction = getLocalizedDesignDirections(locale).find(item => item.recommended);
  return <section className="studio-applied-status" aria-label={t.studio.appliedStatusAria}>
    <span className="studio-applied-icon"><CheckCircle2 size={23} strokeWidth={1.4}/></span>
    <div><span className="studio-kicker">{t.studio.appliedStatusKicker}</span><h2>{direction?.name || appliedIdentity.name}.</h2><p>{direction?.description || appliedIdentity.summary}</p></div>
    <Link href="/">{t.studio.appliedStatusLink}<ArrowUpRight size={17}/></Link>
  </section>;
}
