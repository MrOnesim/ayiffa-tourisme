"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight, MapPin, Menu, Palette, Play, X } from "lucide-react";
import { Brand } from "./brand";
import { site } from "@/lib/content";
import { useCinema } from "./cinema-provider";
import { useLocale } from "./locale-provider";
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n";
import studioEntry from "./design/studio-entry.module.css";

// navigation is built inside the component to use the translated labels

export function Header() {
  const pathname = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const header = useRef<HTMLElement>(null);
  const { openFilm } = useCinema();
const { locale, setLocale, t } = useLocale();
const navigation = [
  { href: "/destinations", label: t.nav.destinations },
  { href: "/circuits", label: t.nav.circuits },
  { href: "/experiences", label: t.nav.experiences },
  { href: "/services", label: t.nav.services },
  { href: "/a-propos", label: t.nav.about },
];

  useEffect(() => {
    menu.current?.close();
    let frame = 0;
    const node = header.current;
    function update() {
      const available = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      node?.setAttribute("data-scrolled", String(window.scrollY > 40));
      node?.style.setProperty("--page-progress", String(Math.min(1, window.scrollY / available)));
      frame = 0;
    }
    function onScroll() { if (!frame) frame = window.requestAnimationFrame(update); }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, [pathname]);

  function closeMenu() { menu.current?.close(); }

  return <header ref={header} className={`site-header signature-navigation ${pathname === "/" ? "site-header-home" : ""}`}>
    <div className="header-inner"><Brand/><nav className="desktop-nav" aria-label="Navigation principale">{navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined} className={pathname.startsWith(item.href) ? "nav-active" : ""}>{item.label}</Link>)}</nav><div className="header-actions"><button className="header-film" onClick={() => openFilm()} aria-label="Ouvrir le film du Bénin"><Play size={11} fill="currentColor"/><span>{t.header.film}</span></button><label className="language-switcher"><span className="sr-only">{t.header.language}</span><select value={locale} onChange={event => setLocale(event.target.value as Locale)} aria-label={t.header.language}>{locales.map(l => <option key={l} value={l}>{localeFlags[l]} {localeNames[l]}</option>)}</select></label><Link className="button button-cta header-cta" href="/contact">{t.header.cta}<ArrowUpRight size={17}/></Link><button className="menu-toggle icon-button" aria-label="Ouvrir le menu" aria-haspopup="dialog" onClick={() => menu.current?.showModal()}><Menu size={25}/></button></div></div>
    <dialog className="mobile-menu" ref={menu} aria-label="Menu de navigation"><div className="mobile-menu-top"><Brand/><button className="icon-button" onClick={closeMenu} aria-label="Fermer le menu"><X size={26}/></button></div><p className="eyebrow">LE BÉNIN, INTENSÉMENT.</p><nav aria-label="Navigation mobile">{navigation.map((item, index) => <Link key={item.href} href={item.href} onClick={closeMenu} style={{ "--menu-index": index } as CSSProperties}><span className="menu-index">0{index + 1}</span>{item.label}<ArrowUpRight size={23}/></Link>)}</nav><button className="mobile-film-link" onClick={() => { closeMenu(); openFilm(); }}><Play size={14} fill="currentColor"/>Le Bénin en mouvement<span>00:22</span></button><Link href="/directions-artistiques" className={studioEntry.mobileLink} onClick={closeMenu}><Palette size={15}/>L’identité & ses inspirations<ArrowUpRight size={16}/></Link><Link href="/contact" className="button button-terra" onClick={closeMenu}>Organiser mon voyage<ArrowUpRight size={18}/></Link><div className="mobile-menu-contact"><MapPin size={16}/>{site.address}<a href={`mailto:${site.email}`}>{site.email}</a></div></dialog>
  </header>;
}
