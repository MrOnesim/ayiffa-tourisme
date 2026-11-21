"use client";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Brand } from "./brand";
import { useContent } from "@/lib/use-content";
import { useLocale } from "./locale-provider";
import { Lines } from "./lines";

export function Footer() {
  const { t } = useLocale();
  const { site } = useContent();
  const ui = t.ui;
  return <>
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand"><Brand light/><p><Lines text={ui.footerTagline}/></p><span className="footer-place"><span className="benin-flag"/> {ui.footerPride}</span></div>
        <div className="footer-column"><h2>{ui.footerExplore}</h2><Link href="/destinations">{ui.footerDestinations}</Link><Link href="/circuits">{ui.footerCircuits}</Link><Link href="/experiences">{ui.footerExperiences}</Link><Link href="/galerie">{ui.footerGallery}</Link></div>
        <div className="footer-column"><h2>{ui.footerAgency}</h2><Link href="/a-propos">{ui.footerStory}</Link><Link href="/services">{ui.footerServices}</Link><Link href="/contact">{ui.footerPlan}</Link><Link href="/contact#questions">{ui.footerQuestions}</Link><Link href="/directions-artistiques">{ui.footerIdentity}</Link></div>
        <div className="footer-column footer-contact"><h2>{ui.footerTalk}</h2><a href={`mailto:${site.email}`}><Mail size={15}/>{site.email}</a><a href={`tel:${site.phoneHref}`}><Phone size={15}/>{site.phone}</a><span><MapPin size={15}/>{site.address}</span><a className="footer-whatsapp" href={site.whatsapp} target="_blank" rel="noopener noreferrer">{ui.footerWhatsapp} <ArrowUpRight size={16}/></a></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} AYIFFA TOURISME. {ui.footerRights}</span><div><Link href="/mentions-legales">{t.footer.legal}</Link><Link href="/confidentialite">{t.footer.privacy}</Link><Link href="/credits">{t.footer.credits}</Link></div><span className="footer-signature">{ui.footerMade}</span></div>
    </footer>
    <a href={site.whatsapp} className="floating-contact" target="_blank" rel="noopener noreferrer" aria-label={`${t.footer.contact} AYIFFA TOURISME`}><MessageCircle size={23} strokeWidth={1.6}/><span>{ui.footerChat}</span></a>
  </>;
}
