import { projectBenin } from "./benin-map";
import { destinations } from "./content";

export type AtlasStop = {
  number: string;
  slug: string;
  name: string;
  shortName: string;
  region: string;
  category: string;
  description: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  labelSide: "left" | "right";
};

const stop = (data: Omit<AtlasStop, "x" | "y">): AtlasStop => ({ ...data, ...projectBenin(data.lon, data.lat) });

export const atlasStops: AtlasStop[] = [
  stop({ number: "01", slug: "ganvie", name: "Ganvié", shortName: "Ganvié", region: "Lac Nokoué", category: "Au fil de l’eau", description: "Un paysage d’eau, des pirogues et l’art de vivre au rythme du lac.", lat: 6.429, lon: 2.466, labelSide: "right" }),
  stop({ number: "02", slug: "ouidah", name: "Ouidah", shortName: "Ouidah", region: "Atlantique", category: "Culture & patrimoine", description: "La mémoire, les traditions et notre point d’ancrage, au bord de l’océan.", lat: 6.3628, lon: 2.0852, labelSide: "right" }),
  stop({ number: "03", slug: "grand-popo", name: "Grand-Popo", shortName: "Grand-Popo", region: "Mono", category: "Évasion & nature", description: "Rencontrer l’océan, les lagunes et la douceur du littoral.", lat: 6.2833, lon: 1.8167, labelSide: "left" }),
  stop({ number: "04", slug: "lac-aheme", name: "Lac Ahémé", shortName: "Lac Ahémé", region: "Sud du Bénin", category: "Au fil de l’eau", description: "Mangroves, savoir-faire et rencontres au plus près de l’eau.", lat: 6.55, lon: 1.9, labelSide: "left" }),
  stop({ number: "05", slug: "save", name: "Les collines de Savè", shortName: "Savè", region: "Collines · Savè", category: "Évasion & nature", description: "Un autre relief, une autre perspective sur le pays.", lat: 8.033, lon: 2.483, labelSide: "right" }),
];

export function atlasDestination(slug: string) {
  return destinations.find(destination => destination.slug === slug);
}
