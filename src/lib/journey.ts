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
    description: "Les récits d’un guide donnent vie aux lieux.",
    href: "/destinations/ouidah", action: "Au cœur des cultures", accent: "#e4ecc1",
    photos: [
      { src: "/images/culture.jpg", alt: "Cérémonie traditionnelle à Abomey-Calavi, au Bénin", caption: "Abomey-Calavi · Bénin" },
      { src: "/images/ville ouidah vu du ciel.jpeg", alt: "Vue aérienne de la ville de Ouidah et de son patrimoine", caption: "Ouidah · Bénin" },
    ],
  },
  {
    id: "lagunes", number: "02", shortLabel: "Explorer", navigationLabel: "Suivre le rythme de l’eau",
    eyebrow: "PIROGUES & LAGUNES", verb: "Explorer.", line: "Au rythme de l’eau.",
    description: "À Ganvié, les chemins sont faits d’eau.",
    href: "/destinations/ganvie", action: "Découvrir Ganvié", accent: "#d9e9e1",
    photos: [
      { src: "/images/ganvie vu du ciel.jpeg", alt: "Vue aérienne de Ganvié avec ses maisons sur pilotis et ses pirogues", caption: "Ganvié · Lac Nokoué" },
      { src: "/images/GANVIE.jpeg", alt: "Maisons sur pilotis et pirogues au cœur de Ganvié", caption: "Ganvié · Vie lacustre" },
    ],
  },
  {
    id: "memoire", number: "03", shortLabel: "Comprendre", navigationLabel: "Comprendre les histoires de Ouidah",
    eyebrow: "HISTOIRE & PATRIMOINE", verb: "Se souvenir.", line: "Pour mieux comprendre.",
    description: "À Ouidah, l’histoire invite à l’écoute.",
    href: "/circuits/route-des-esclaves", action: "Les chemins de mémoire", accent: "#efddc3",
    photos: [
      { src: "/images/ouidah vu du ciel 1.jpeg", alt: "Vue aérienne de la côte et du paysage de Ouidah", caption: "Ouidah · Côte Atlantique" },
    ],
  },
  {
    id: "littoral", number: "04", shortLabel: "Ralentir", navigationLabel: "S’offrir le luxe de ralentir",
    eyebrow: "LE LUXE DU TEMPS", verb: "Ralentir.", line: "Tout simplement.",
    description: "Grand-Popo : le luxe de ralentir.",
    href: "/destinations/grand-popo", action: "Retrouver l’horizon", accent: "#e9e4bb",
    photos: [
      { src: "/images/Grand popo.jpeg", alt: "Vue aérienne de la plage et des cocotiers de Grand-Popo", caption: "Grand-Popo · Océan Atlantique" },
      { src: "/images/plage ouidah.jpeg", alt: "Palmiers et parasols sur la plage près de Ouidah", caption: "Côte Atlantique · Bénin" },
    ],
  },
];

export const departurePostcards = [
  { title: "Ouidah", label: "MÉMOIRE & CULTURE", image: "/images/ville ouidah vu du ciel.jpeg", alt: "Ouidah vu du ciel avec son patrimoine urbain", href: "/destinations/ouidah", note: "Ouidah · Bénin" },
  { title: "Ganvié", label: "AU FIL DE L’EAU", image: "/images/ganvie vu du ciel.jpeg", alt: "Ganvié vu du ciel avec ses maisons sur pilotis", href: "/destinations/ganvie", note: "Lac Nokoué · Bénin" },
  { title: "Les rencontres", label: "LE BÉNIN VIVANT", image: "/images/culture.jpg", alt: "Une cérémonie traditionnelle à Abomey-Calavi", href: "/experiences", note: "Abomey-Calavi · Bénin" },
  { title: "Grand-Popo", label: "L’ART DE RALENTIR", image: "/images/Grand popo.jpeg", alt: "Cocotiers et parasols sur la plage de Grand-Popo", href: "/destinations/grand-popo", note: "Grand-Popo · Bénin" },
  { title: "Les lagunes", label: "NATURE & RENCONTRES", image: "/images/GANVIE.jpeg", alt: "Maisons sur pilotis et pirogues sur le lac Nokoué", href: "/circuits/gogotinkpon", note: "Ganvié · Lac Nokoué" },
];
