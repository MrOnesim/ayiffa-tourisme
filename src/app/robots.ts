import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
export default function robots():MetadataRoute.Robots{
  return {rules:process.env.SITE_INDEXABLE==="true"?{userAgent:"*",allow:"/",disallow:["/api/"]}:{userAgent:"*",disallow:"/"},sitemap:new URL("/sitemap.xml",site.url).href};
}
