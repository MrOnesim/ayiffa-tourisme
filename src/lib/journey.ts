export type JourneyPhoto = { src: string; alt: string; caption: string };
export type JourneyChapter = {
  id: string;
  number: string;
  shortLabel: string;
  navigationLabel: string;
  eyebrow: string;
  verb: string;
  line: string;
  description: string;
  href: string;
  action: string;
  accent: string;
  photos: JourneyPhoto[];
};

export const journeyChapters: JourneyChapter[] = [
  {
    id: "rencontres", number: "01", shortLabel: "Rencontrer", navigationLabel: "Rencontrer une culture vivante",
    eyebrow: "CULTURES VIVANTES", verb: "Rencontrer.", line: "Un autre regard.",
    description: "Écouter les récits d’un guide, comprendre les lieux et leurs traditions. Le plus beau du Bénin commence souvent par une rencontre.",
    href: "/destinations/ouidah", action: "Au cœur des cultures", accent: "#e4ecc1",
    photos: [
      { src: "/images/culture.jpg", alt: "Cérémonie traditionnelle à Abomey-Calavi, au Bénin", caption: "Abomey-Calavi · Bénin" },
      { src: "/images/ouidah.jpg", alt: "Paysage et cases traditionnelles de Ouidah vus du ciel", caption: "Ouidah · Bénin" },
    ],
  },
  {
    id: "lagunes", number: "02", shortLabel: "Explorer", navigationLabel: "Suivre le rythme de l’eau",
    eyebrow: "PIROGUES & LAGUNES", verb: "Explorer.", line: "Au rythme de l’eau.",
    description: "À Ganvié, les chemins sont faits d’eau. Une pirogue, un paysage, une manière singulière d’habiter le lac et de découvrir le Bénin.",
    href: "/destinations/ganvie", action: "Découvrir Ganvié", accent: "#d9e9e1",
    photos: [
      { src: "/images/ganvie.jpg", alt: "Une pirogue à la voile colorée sur le lac Nokoué près de Ganvié", caption: "Ganvié · Lac Nokoué" },
      { src: "/images/pirogue.jpg", alt: "Une femme navigue en pirogue dans les herbes du lac Nokoué", caption: "Lac Nokoué · Bénin" },
    ],
  },
  {
    id: "memoire", number: "03", shortLabel: "Comprendre", navigationLabel: "Comprendre les histoires de Ouidah",
    eyebrow: "HISTOIRE & PATRIMOINE", verb: "Se souvenir.", line: "Pour mieux comprendre.",
    description: "À Ouidah, l’histoire invite à l’écoute. Une découverte sensible des lieux de mémoire et des récits qui traversent les générations.",
    href: "/circuits/route-des-esclaves", action: "Les chemins de mémoire", accent: "#efddc3",
    photos: [
      { src: "/images/ouidah.jpg", alt: "Une vue aérienne du paysage de Ouidah, ville de mémoire du Bénin", caption: "Ouidah · Photographie d’ambiance" },
    ],
  },
  {
    id: "littoral", number: "04", shortLabel: "Ralentir", navigationLabel: "S’offrir le luxe de ralentir",
    eyebrow: "LE LUXE DU TEMPS", verb: "Ralentir.", line: "Tout simplement.",
    description: "Le souffle de l’Atlantique, les lumières de Grand-Popo. Et le plaisir discret de n’avoir rien à précipiter.",
    href: "/destinations/grand-popo", action: "Retrouver l’horizon", accent: "#e9e4bb",
    photos: [
      { src: "/images/grand-popo.jpg", alt: "Le littoral de Grand-Popo entre la plage, les vagues et les cocotiers", caption: "Grand-Popo · Océan Atlantique" },
      { src: "/images/grand-popo-palms.jpg", alt: "Des hamacs sous les cocotiers à Grand-Popo", caption: "Grand-Popo · Le temps suspendu" },
    ],
  },
];

export const departurePostcards = [
  { title: "Ouidah", label: "MÉMOIRE & CULTURE", image: "/images/ouidah.jpg", alt: "Ouidah et ses cases vues du ciel", href: "/destinations/ouidah", note: "Ouidah · Bénin" },
  { title: "Ganvié", label: "AU FIL DE L’EAU", image: "/images/ganvie.jpg", alt: "Une pirogue à voile sur le lac Nokoué près de Ganvié", href: "/destinations/ganvie", note: "Lac Nokoué · Bénin" },
  { title: "Les rencontres", label: "LE BÉNIN VIVANT", image: "/images/culture.jpg", alt: "Une cérémonie traditionnelle à Abomey-Calavi", href: "/experiences", note: "Abomey-Calavi · Bénin" },
  { title: "Grand-Popo", label: "L’ART DE RALENTIR", image: "/images/grand-popo-palms.jpg", alt: "Cocotiers et hamacs à Grand-Popo", href: "/destinations/grand-popo", note: "Grand-Popo · Bénin" },
  { title: "Les lagunes", label: "NATURE & RENCONTRES", image: "/images/lagoon.jpg", alt: "Traversée en pirogue sur la lagune de Grand-Popo", href: "/circuits/gogotinkpon", note: "Image d’ambiance · Grand-Popo" },
];
