"use client";

import { Compass } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

export default function Loading() {
  const { t } = useLocale();
  return <div className="load-placeholder" role="status" aria-live="polite"><div style={{ textAlign: "center" }}><Compass size={36} strokeWidth={1} style={{ margin: "0 auto 20px" }}/><p className="eyebrow">{t.common.loadingHorizon}</p></div></div>;
}
