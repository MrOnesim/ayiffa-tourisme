import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/content";
import { CinemaProvider } from "@/components/cinema-provider";
import { LocaleProvider } from "@/components/locale-provider";
import "./globals.css";
import "./cinematic.css";
import "./visit-inspired.css";
import "./signature.css";
import "./atlas.css";
import { appliedIdentity } from "@/lib/applied-identity";
import { getServerLocale } from "@/lib/get-locale-server";

const sans = Manrope({ weight: ["400", "500", "600", "700", "800"], style: "normal", subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });
const editorial = Cormorant_Garamond({ weight: "500", style: ["normal", "italic"], subsets: ["latin", "latin-ext"], variable: "--font-editorial", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {default:"AYIFFA TOURISME — Le Bénin, intensément",template:"%s | AYIFFA TOURISME"},
  description:"Découvrez le Bénin avec AYIFFA TOURISME, agence locale à Ouidah. Destinations, visites guidées, croisières et voyages personnalisés, à votre rythme.",
  applicationName:"AYIFFA TOURISME",
  openGraph:{type:"website",locale:"fr_FR",siteName:site.name,title:"AYIFFA TOURISME — Le Bénin, intensément",description:"Des lieux qui émerveillent. Des rencontres qui restent. Imaginez votre voyage au Bénin avec une agence locale.",images:[{url:"/images/ganvie.jpg",width:1880,height:1250,alt:"Une pirogue sur le lac Nokoué à Ganvié, Bénin"}]},
  twitter:{card:"summary_large_image",title:"AYIFFA TOURISME — Le Bénin, intensément",description:"Une autre idée du voyage au Bénin.",images:["/images/ganvie.jpg"]},
  robots: process.env.SITE_INDEXABLE === "true" ? {index:true,follow:true} : {index:false,follow:true},
};
export const viewport: Viewport = {width:"device-width",initialScale:1,themeColor:"#163e31"};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getServerLocale();
  const structuredData = {"@context":"https://schema.org","@type":"TravelAgency",name:site.name,url:site.url,email:site.email,address:{"@type":"PostalAddress",addressLocality:"Ouidah",addressRegion:"Atlantique",addressCountry:"BJ"},areaServed:{"@type":"Country",name:"Bénin"},description:"Visites guidées, croisières et séjours personnalisés au Bénin."};
  return <html lang={locale} className={`${sans.variable} ${editorial.variable}`}><body className="ayiffa-signature" data-design={appliedIdentity.id}><a href="#contenu" className="skip-link">Aller au contenu</a><CinemaProvider><LocaleProvider initialLocale={locale}><Header/><main id="contenu">{children}</main><Footer/></LocaleProvider></CinemaProvider><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/></body></html>;
}
