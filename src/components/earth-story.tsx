import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { SunEmblem } from "./brand";
import { Reveal } from "./reveal";

export function EarthStory() {
  return <section className="earth-story-section" aria-labelledby="earth-story-title">
    <div className="container earth-story-layout">
      <Reveal className="earth-story-copy" variant="soft"><p className="eyebrow">BIENVENUE CHEZ AYIFFA</p><h2 id="earth-story-title">VIVRE.<br/>LE BÉNIN.<br/><span>VRAIMENT.</span></h2><p className="earth-story-lead">On visite un pays.<br/><em>On rencontre son âme.</em></p><p>Notre point de départ, c’est Ouidah. Notre envie : vous faire découvrir des lieux, mais aussi les histoires et les personnes qui leur donnent vie.</p><p>Visites guidées, croisières locales et séjours personnalisés : le voyage se construit autour de vos envies, au rythme des rencontres.</p><Link href="/a-propos" className="button button-terra">Faire connaissance avec AYIFFA<ArrowUpRight size={18}/></Link><span className="earth-story-place"><MapPin size={13}/>Ouidah · Atlantique · Bénin</span></Reveal>
      <Reveal className="earth-story-visual" variant="image"><div className="earth-story-pattern" aria-hidden="true"/><div className="earth-story-portrait"><Image src="/images/culture.jpg" alt="Cérémonie et traditions vivantes à Abomey-Calavi, au Bénin" fill sizes="(max-width: 700px) 85vw, 42vw"/></div><div className="earth-story-postcard"><Image src="/images/ouidah.jpg" alt="Les cases et les paysages de Ouidah vus du ciel" fill sizes="(max-width: 700px) 55vw, 24vw"/><span>Ouidah, vue du ciel.</span></div><div className="earth-story-seal" aria-hidden="true"><SunEmblem/><span>LE GOÛT DU VRAI</span></div><span className="earth-story-note">Des visages.<br/>Des histoires.<br/><em>Des liens.</em></span><p className="earth-story-credit">Cultures du Bénin · photographie à Abomey-Calavi</p></Reveal>
    </div>
  </section>;
}
