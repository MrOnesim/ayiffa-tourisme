import type { Metadata } from "next";
import { DesignStudio } from "@/components/design/design-studio";
import { isDesignDirection } from "@/lib/design-directions";
import { getServerLocale } from "@/lib/get-locale-server";
import { getPageMetadata } from "@/lib/page-metadata";
import "./studio.css";

export async function generateMetadata(): Promise<Metadata> {
  return { ...getPageMetadata(await getServerLocale(), "studio", "/directions-artistiques"), robots: { index: false, follow: false } };
}

export default async function DesignDirectionsPage({ searchParams }: { searchParams: Promise<{ direction?: string; format?: string }> }) {
  const params = await searchParams;
  const direction = isDesignDirection(params.direction) ? params.direction : "signature";
  return <DesignStudio initialDirection={direction} initialDevice={params.format === "mobile" ? "mobile" : "desktop"}/>;
}
