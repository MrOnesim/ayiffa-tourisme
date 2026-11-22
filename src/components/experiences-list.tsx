"use client";
import Image from "next/image";
import { Reveal } from "./reveal";
import { ButtonLink } from "./ui";
import { useContent } from "@/lib/use-content";
import { useLocale } from "./locale-provider";

export function ExperiencesList() {
  const { experiences } = useContent();
  const { t } = useLocale();
  const ui = t.ui;
  const descriptions = [ui.experienceDesc1, ui.experienceDesc2, ui.experienceDesc3];
  return <div className="container experiences-list">{experiences.map((experience, index) => <section className="editorial-split" key={experience.number}><Reveal className="editorial-image"><Image src={experience.image} alt={experience.alt} fill priority={index===0} sizes="(max-width: 700px) 100vw, 45vw"/></Reveal><Reveal className="editorial-copy"><span className="experience-number">{experience.number}</span><p className="eyebrow">{experience.category}</p><h2>{experience.title}</h2><p>{experience.text}</p><p>{descriptions[index] ?? ""}</p><ButtonLink href={experience.href}>{ui.experienceExplore}</ButtonLink></Reveal></section>)}</div>;
}
