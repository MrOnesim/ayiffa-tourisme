"use client";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { SunEmblem } from "./brand";
import { Reveal } from "./reveal";
import { useLocale } from "./locale-provider";
import { Lines } from "./lines";

export function EarthStory() {
  const { t } = useLocale();
  const ui = t.ui;
  const storyLines = ui.storyTitle.split("\n");
  return <section className="earth-story-section" aria-labelledby="earth-story-title">
    <div className="container earth-story-layout">
      <Reveal className="earth-story-copy" variant="soft"><p className="eyebrow">{ui.storyEyebrow}</p><h2 id="earth-story-title">{storyLines[0]}<br/>{storyLines[1]}<br/><span>{storyLines[2]}</span></h2><p className="earth-story-lead"><Lines text={ui.storyLead}/></p><p>{ui.storyP1}</p><p>{ui.storyP2}</p><Link href="/a-propos" className="button button-terra">{ui.storyCta}<ArrowUpRight size={18}/></Link><span className="earth-story-place"><MapPin size={13}/>Ouidah · Atlantique · {ui.benin}</span></Reveal>
      <Reveal className="earth-story-visual" variant="image"><div className="earth-story-pattern" aria-hidden="true"/><div className="earth-story-portrait"><Image src="/images/ville ouidah vu du ciel.jpeg" alt={ui.storyImageAlt1} fill sizes="(max-width: 700px) 85vw, 42vw"/></div><div className="earth-story-postcard"><Image src="/images/ville ganvie (1).jpeg" alt={ui.storyImageAlt2} fill sizes="(max-width: 700px) 55vw, 24vw"/><span>{ui.storyPostcard}</span></div><div className="earth-story-seal" aria-hidden="true"><SunEmblem/><span>{ui.storySeal}</span></div><span className="earth-story-note"><Lines text={ui.storyNote}/></span><p className="earth-story-credit">{ui.storyCredit}</p></Reveal>
    </div>
  </section>;
}
