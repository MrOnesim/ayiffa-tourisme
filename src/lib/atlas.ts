import { destinations } from "./content";

export type AtlasStop = {
  number: string;
  slug: string;
  name: string;
  shortName: string;
  region: string;
  category: string;
  description: string;
  x: number;
  y: number;
  labelSide: "left" | "right";
};

export const atlasStops: AtlasStop[] = [
  { number: "01", slug: "ganvie", name: "Ganvié", shortName: "Ganvié", region: "Lac Nokoué", category: "Au fil de l’eau", description: "Un paysage d’eau, des pirogues et l’art de vivre au rythme du lac.", x: 425, y: 585, labelSide: "right" },
  { number: "02", slug: "ouidah", name: "Ouidah", shortName: "Ouidah", region: "Atlantique", category: "Culture & patrimoine", description: "La mémoire, les traditions et notre point d’ancrage, au bord de l’océan.", x: 390, y: 630, labelSide: "right" },
  { number: "03", slug: "grand-popo", name: "Grand-Popo", shortName: "Grand-Popo", region: "Mono", category: "Évasion & nature", description: "Rencontrer l’océan, les lagunes et la douceur du littoral.", x: 355, y: 650, labelSide: "left" },
  { number: "04", slug: "lac-aheme", name: "Lac Ahémé", shortName: "Lac Ahémé", region: "Sud du Bénin", category: "Au fil de l’eau", description: "Mangroves, savoir-faire et rencontres au plus près de l’eau.", x: 345, y: 580, labelSide: "left" },
  { number: "05", slug: "save", name: "Les collines de Savè", shortName: "Savè", region: "Collines · Savè", category: "Évasion & nature", description: "Un autre relief, une autre perspective sur le pays.", x: 405, y: 420, labelSide: "right" },
];

export function atlasDestination(slug: string) {
  return destinations.find(destination => destination.slug === slug);
}
