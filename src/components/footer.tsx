"use client";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Brand } from "./brand";
import { site } from "@/lib/content";
import { useLocale } from "./locale-provider";

export function Footer() {
  const { t } = useLocale();
  return <>
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand"><Brand light/><p>Le Bénin ne se raconte pas seulement.<br/>Il se rencontre, il se ressent, il se vit.</p><span className="footer-place"><span className="benin-flag"/> Fiers de vous faire découvrir le Bénin.</span></div>
        <div className="footer-column"><h2>Explorer</h2><Link href="/destinations">Nos destinations</Link><Link href="/circuits">Circuits & voyages</Link><Link href="/experiences">Nos expériences</Link><Link href="/galerie">Le Bénin en images</Link></div>
        <div className="footer-column"><h2>AYIFFA & vous</h2><Link href="/a-propos">Notre histoire</Link><Link href="/services">Nos services</Link><Link href="/contact">Organiser un voyage</Link><Link href="/contact#questions">Vos questions</Link><Link href="/directions-artistiques">L’identité AYIFFA</Link></div>
        <div className="footer-column footer-contact"><h2>Parlons de votre voyage</h2><a href={`mailto:${site.email}`}><Mail size={15}/>{site.email}</a><a href={`tel:${site.phoneHref}`}><Phone size={15}/>{site.phone}</a><span><MapPin size={15}/>{site.address}</span><a className="footer-whatsapp" href={site.whatsapp} target="_blank" rel="noopener noreferrer">Échanger sur WhatsApp <ArrowUpRight size={16}/></a></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} AYIFFA TOURISME. Le voyage, autrement.</span><div><Link href="/mentions-legales">{t.footer.legal}</Link><Link href="/confidentialite">{t.footer.privacy}</Link><Link href="/credits">{t.footer.credits}</Link></div><span className="footer-signature">Imaginé avec cœur.</span></div>
    </footer>
    <a href={site.whatsapp} className="floating-contact" target="_blank" rel="noopener noreferrer" aria-label="Contacter AYIFFA TOURISME sur WhatsApp"><MessageCircle size={23} strokeWidth={1.6}/><span>Parlons voyage</span></a>
  </>;
}
