import type { MetadataRoute } from "next";
import { destinations, circuits, site } from "@/lib/content";
export default function sitemap():MetadataRoute.Sitemap{
  const routes=["/","/destinations","/circuits","/experiences","/services","/a-propos","/contact","/galerie","/credits","/mentions-legales","/confidentialite",...destinations.map(d=>`/destinations/${d.slug}`),...circuits.map(c=>`/circuits/${c.slug}`)];
  return routes.map(route=>({url:new URL(route,site.url).href,lastModified:new Date(),changeFrequency:route==="/"?"weekly":"monthly",priority:route==="/"?1:["/destinations","/circuits","/contact"].includes(route)?.9:route.includes("/credits")||route.includes("legales")||route.includes("confidentialite")?.2:.7}));
}
