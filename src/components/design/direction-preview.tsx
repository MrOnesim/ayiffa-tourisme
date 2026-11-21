"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, MapPin, MessageCircle, Play, SlidersHorizontal, Sparkles } from "lucide-react";
import { Brand, SunEmblem } from "@/components/brand";
import { AmbientVideo } from "@/components/ambient-video";
import { useCinema } from "@/components/cinema-provider";
import { beninFilm } from "@/lib/film";
import { useContent } from "@/lib/use-content";
import { useLocale } from "@/components/locale-provider";
import type { DesignDirectionId, PreviewDevice } from "@/lib/design-directions";

function PreviewHeader({ light = false }: { light?: boolean }) {
  const { t } = useLocale();
  const mock = t.studio.mock;
  return <div className={`mock-navigation ${light ? "mock-navigation-light" : ""}`}>
    <Brand light={light}/>
    <nav aria-label={mock.navAria}><Link href="/destinations">{mock.navDestinations}</Link><Link href="/circuits">{mock.navTrips}</Link><Link href="/a-propos">{mock.navAgency}</Link></nav>
    <Link className="mock-navigation-cta" href="/contact">{mock.navCta}<ArrowUpRight size={12}/></Link>
  </div>;
}

function SignaturePreview({ animated }: { animated: boolean }) {
  const { openFilm } = useCinema();
  const { t } = useLocale();
  const mock = t.studio.mock;
  return <>
    <div className="mock-signature">
      <Image className="mock-signature-image" src={beninFilm.poster} alt={mock.posterAlt} fill sizes="(max-width: 700px) 95vw, 70vw"/>
      <AmbientVideo active={animated} paused={!animated} className="mock-ambient"/>
      <div className="mock-signature-shade"/>
      <PreviewHeader light/>
      <div className="mock-signature-copy"><p className="mock-kicker">{mock.signatureKicker}</p><h2>{mock.signatureTitleA}<br/><em>{mock.signatureTitleB}</em></h2><p dangerouslySetInnerHTML={{ __html: mock.signatureText }}/><Link className="mock-action" href="/destinations">{mock.signatureDiscover}<ArrowUpRight size={16}/></Link></div>
      <button className="mock-film" onClick={() => openFilm()} aria-label={mock.signatureFilmAria}><span><Play size={17} fill="currentColor"/></span><em>{mock.signatureFilmText}</em><small>{mock.signatureFilmSmall}</small></button>
      <div className="mock-signature-location"><MapPin size={12}/><span>{mock.signatureLocation}</span><span>{mock.signatureNote}</span></div>
    </div>
    <div className="mock-assurances"><span><Compass size={15}/>{mock.assurances[0]}</span><span><SlidersHorizontal size={15}/>{mock.assurances[1]}</span><span><MessageCircle size={15}/>{mock.assurances[2]}</span></div>
  </>;
}

function EarthPreview() {
  const { t } = useLocale();
  const mock = t.studio.mock;
  return <div className="mock-earth">
    <PreviewHeader/>
    <div className="mock-earth-hero">
      <div className="mock-earth-copy"><p className="mock-kicker">{mock.earthKicker}</p><h2 dangerouslySetInnerHTML={{ __html: mock.earthTitle }}/><p>{mock.earthText}</p><Link className="mock-action" href="/experiences">{mock.earthCta}<ArrowUpRight size={17}/></Link></div>
      <div className="mock-earth-art"><span className="mock-earth-pattern" aria-hidden="true"/><div className="mock-earth-portrait"><Image src="/images/ville ouidah vu du ciel.jpeg" alt={mock.earthPortraitAlt} fill sizes="(max-width: 700px) 80vw, 30vw"/></div><div className="mock-earth-postcard"><Image src="/images/ville ganvie (1).jpeg" alt={mock.earthPostcardAlt} fill sizes="200px"/></div><div className="mock-earth-stamp" aria-hidden="true"><SunEmblem/></div><span className="mock-earth-note" dangerouslySetInnerHTML={{ __html: mock.earthNote }}/></div>
    </div>
    <div className="mock-earth-ribbon"><span>{mock.earthRibbon[0]}</span><span aria-hidden="true">✳</span><span>{mock.earthRibbon[1]}</span><span aria-hidden="true">✳</span><span>{mock.earthRibbon[2]}</span></div>
  </div>;
}

function ClarityPreview() {
  const { destinations } = useContent();
  const { t } = useLocale();
  const mock = t.studio.mock;
  return <div className="mock-clarity">
    <PreviewHeader/>
    <div className="mock-clarity-hero">
      <div className="mock-clarity-copy"><span className="mock-local">{mock.clarityLocal}</span><h2 dangerouslySetInnerHTML={{ __html: mock.clarityTitle }}/><p>{mock.clarityText}</p><form action="/destinations" className="mock-search"><MapPin size={17}/><label><span>{mock.claritySearchLabel}</span><select name="destination" defaultValue="" aria-label={mock.clarityDestinationAria}><option value="">{mock.clarityAll}</option>{destinations.map(destination => <option key={destination.slug} value={destination.slug}>{destination.name}</option>)}</select></label><button type="submit" aria-label={mock.clarityExploreAria}><ArrowRight size={20}/></button></form><Link className="mock-clarity-link" href="/contact">{mock.clarityCta}<ArrowUpRight size={15}/></Link></div>
      <div className="mock-clarity-photo"><Image src="/images/deux voi vu du ciel.jpeg" alt={mock.clarityPhotoAlt} fill sizes="(max-width: 700px) 85vw, 30vw"/><span className="mock-clarity-location"><MapPin size={13}/><span>{mock.clarityLocation}<small>{mock.clarityLocationNote}</small></span></span><span className="mock-clarity-note"><Sparkles size={13}/>{mock.clarityNote}</span></div>
    </div>
    <div className="mock-clarity-benefits"><span><Compass size={18}/><strong>{mock.benefits[0]}</strong></span><span><SlidersHorizontal size={18}/><strong>{mock.benefits[1]}</strong></span><span><MessageCircle size={18}/><strong>{mock.benefits[2]}</strong></span></div>
  </div>;
}

export function DirectionPreview({ direction, device, animated }: { direction: DesignDirectionId; device: PreviewDevice; animated: boolean }) {
  return <div className={`design-preview theme-${direction}`} data-preview-device={device} data-motion={animated ? "on" : "off"}>
    <div className="concept-screen" key={direction}>
      {direction === "signature" ? <SignaturePreview animated={animated}/> : direction === "terre-vivante" ? <EarthPreview/> : <ClarityPreview/>}
    </div>
  </div>;
}
