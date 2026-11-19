"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, MapPin, MessageCircle, Play, SlidersHorizontal, Sparkles } from "lucide-react";
import { Brand, SunEmblem } from "@/components/brand";
import { AmbientVideo } from "@/components/ambient-video";
import { useCinema } from "@/components/cinema-provider";
import { beninFilm } from "@/lib/film";
import { useContent } from "@/lib/use-content";
import type { DesignDirectionId, PreviewDevice } from "@/lib/design-directions";

function PreviewHeader({ light = false }: { light?: boolean }) {
  return <div className={`mock-navigation ${light ? "mock-navigation-light" : ""}`}>
    <Brand light={light}/>
    <nav aria-label="Navigation de l’aperçu"><Link href="/destinations">Destinations</Link><Link href="/circuits">Nos voyages</Link><Link href="/a-propos">L’agence</Link></nav>
    <Link className="mock-navigation-cta" href="/contact">Mon voyage<ArrowUpRight size={12}/></Link>
  </div>;
}

function SignaturePreview({ animated }: { animated: boolean }) {
  const { openFilm } = useCinema();
  return <>
    <div className="mock-signature">
      <Image className="mock-signature-image" src={beninFilm.poster} alt="Une pirogue à voile sur le lac Nokoué, au Bénin" fill sizes="(max-width: 700px) 95vw, 70vw"/>
      <AmbientVideo active={animated} paused={!animated} className="mock-ambient"/>
      <div className="mock-signature-shade"/>
      <PreviewHeader light/>
      <div className="mock-signature-copy"><p className="mock-kicker"><span/>L’ESSENTIEL DU VOYAGE. L’ÂME DU BÉNIN.</p><h2>Le Bénin,<br/><em>intensément.</em></h2><p>Des lieux qui émerveillent.<br/>Des rencontres qui restent.</p><Link className="mock-action" href="/destinations">Découvrir nos destinations<ArrowUpRight size={16}/></Link></div>
      <button className="mock-film" onClick={() => openFilm()} aria-label="Voir le film depuis la proposition Signature"><span><Play size={17} fill="currentColor"/></span><em>Le voyage commence ici.</em><small>VOIR LE FILM · 00:22</small></button>
      <div className="mock-signature-location"><MapPin size={12}/><span>Ganvié & Ouidah, Bénin</span><span>Un autre regard sur le voyage.</span></div>
    </div>
    <div className="mock-assurances"><span><Compass size={15}/>Une agence locale</span><span><SlidersHorizontal size={15}/>Un voyage à votre image</span><span><MessageCircle size={15}/>Un échange, simplement</span></div>
  </>;
}

function EarthPreview() {
  return <div className="mock-earth">
    <PreviewHeader/>
    <div className="mock-earth-hero">
      <div className="mock-earth-copy"><p className="mock-kicker">DES VISAGES. DES HISTOIRES. DU VIVANT.</p><h2>VIVRE.<br/>LE BÉNIN.<br/><span>VRAIMENT.</span></h2><p>Les belles rencontres ne se programment pas toutes. Mais le voyage commence ici.</p><Link className="mock-action" href="/experiences">Rencontrer le Bénin<ArrowUpRight size={17}/></Link></div>
      <div className="mock-earth-art"><span className="mock-earth-pattern" aria-hidden="true"/><div className="mock-earth-portrait"><Image src="/images/culture.jpg" alt="Traditions et cérémonie à Abomey-Calavi, au Bénin" fill sizes="(max-width: 700px) 80vw, 30vw"/></div><div className="mock-earth-postcard"><Image src="/images/ouidah.jpg" alt="Les paysages de Ouidah vus du ciel" fill sizes="200px"/></div><div className="mock-earth-stamp" aria-hidden="true"><SunEmblem/></div><span className="mock-earth-note">Des histoires<br/>à partager.</span></div>
    </div>
    <div className="mock-earth-ribbon"><span>RENCONTRER.</span><span aria-hidden="true">✳</span><span>COMPRENDRE.</span><span aria-hidden="true">✳</span><span>RESSENTIR.</span></div>
  </div>;
}

function ClarityPreview() {
  const { destinations } = useContent();
  return <div className="mock-clarity">
    <PreviewHeader/>
    <div className="mock-clarity-hero">
      <div className="mock-clarity-copy"><span className="mock-local"><span/>AGENCE LOCALE · OUIDAH</span><h2>Votre voyage.<br/>À votre mesure.</h2><p>Des étapes choisies, un rythme qui vous ressemble. Commençons par ce qui vous fait envie.</p><form action="/destinations" className="mock-search"><MapPin size={17}/><label><span>VOTRE PROCHAINE ESCALE</span><select name="destination" defaultValue="" aria-label="Destination dans la proposition Ligne claire"><option value="">Toutes les destinations</option>{destinations.map(destination => <option key={destination.slug} value={destination.slug}>{destination.name}</option>)}</select></label><button type="submit" aria-label="Explorer la destination de l’aperçu"><ArrowRight size={20}/></button></form><Link className="mock-clarity-link" href="/contact">Parlons de votre projet<ArrowUpRight size={15}/></Link></div>
      <div className="mock-clarity-photo"><Image src="/images/grand-popo.jpg" alt="La plage de Grand-Popo, au bord de l’océan Atlantique" fill sizes="(max-width: 700px) 85vw, 30vw"/><span className="mock-clarity-location"><MapPin size={13}/><span>Grand-Popo<small>L’océan pour horizon.</small></span></span><span className="mock-clarity-note"><Sparkles size={13}/>À votre rythme.</span></div>
    </div>
    <div className="mock-clarity-benefits"><span><Compass size={18}/><strong>Le regard local.</strong></span><span><SlidersHorizontal size={18}/><strong>La liberté du sur-mesure.</strong></span><span><MessageCircle size={18}/><strong>Un contact direct.</strong></span></div>
  </div>;
}

export function DirectionPreview({ direction, device, animated }: { direction: DesignDirectionId; device: PreviewDevice; animated: boolean }) {
  return <div className={`design-preview theme-${direction}`} data-preview-device={device} data-motion={animated ? "on" : "off"}>
    <div className="concept-screen" key={direction}>
      {direction === "signature" ? <SignaturePreview animated={animated}/> : direction === "terre-vivante" ? <EarthPreview/> : <ClarityPreview/>}
    </div>
  </div>;
}
