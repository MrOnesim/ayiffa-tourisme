import type { Metadata } from "next";
import { DesignStudio } from "@/components/design/design-studio";
import { isDesignDirection } from "@/lib/design-directions";
import "./studio.css";

export const metadata: Metadata = {
  title: "Identité appliquée — Signature, vivante et claire",
  description: "Retrouvez les inspirations réunies dans l’identité appliquée d’AYIFFA TOURISME : Signature, Terre vivante et Ligne claire.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/directions-artistiques" },
};

export default async function DesignDirectionsPage({ searchParams }: { searchParams: Promise<{ direction?: string; format?: string }> }) {
  const params = await searchParams;
  const direction = isDesignDirection(params.direction) ? params.direction : "signature";
  return <DesignStudio initialDirection={direction} initialDevice={params.format === "mobile" ? "mobile" : "desktop"}/>;
}
