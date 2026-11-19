"use client";
import Image from "next/image";
import { Reveal } from "./reveal";
import { ButtonLink, TravelCTA } from "./ui";
import { useContent } from "@/lib/use-content";

const descriptions = [
  "À Ouidah, les récits historiques côtoient les cultures d’aujourd’hui. Une visite guidée permet de donner du sens aux lieux, de découvrir leur mémoire et de mieux comprendre leurs traditions. Chaque rencontre se fait avec attention, dans le respect des habitants et de leurs usages.",
  "Une pirogue devient un chemin. Sur le lac Nokoué, la vie s’organise autour de l’eau ; dans les lagunes du sud, le paysage change à chaque détour. L’agence présente plusieurs découvertes nautiques, dont l’organisation dépend des conditions locales et de la navigation.",
  "Il suffit parfois d’un horizon pour changer de rythme. Grand-Popo invite à regarder les paysages du littoral et les eaux du Mono autrement. Composez une étape de découverte autour de vos envies, sans confondre le plaisir du rivage avec une promesse de baignade : les conditions de sécurité restent essentielles.",
];

export function ExperiencesList() {
  const { experiences } = useContent();
  return <div className="container experiences-list">{experiences.map((experience, index) => <section className="editorial-split" key={experience.number}><Reveal className="editorial-image"><Image src={experience.image} alt={experience.alt} fill sizes="(max-width: 700px) 100vw, 45vw"/></Reveal><Reveal className="editorial-copy"><span className="experience-number">{experience.number}</span><p className="eyebrow"><span/>{experience.category}</p><h2>{experience.title}.</h2><p>{experience.text}</p><p>{descriptions[index]}</p><ButtonLink href={experience.href}>Explorer cette expérience</ButtonLink></Reveal></section>)}</div>;
}