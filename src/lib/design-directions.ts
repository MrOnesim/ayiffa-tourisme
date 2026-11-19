export type DesignDirectionId = "signature" | "terre-vivante" | "ligne-claire";
export type PreviewDevice = "desktop" | "mobile";

export type DesignDirection = {
  id: DesignDirectionId;
  number: string;
  name: string;
  subtitle: string;
  personality: string;
  description: string;
  recommended: boolean;
  palette: { name: string; value: string }[];
  displayFont: string;
  bodyFont: string;
  typography: string;
  composition: string;
  movements: string[];
  idealFor: string;
  watchpoint: string;
};

export const designDirections: DesignDirection[] = [
  {
    id: "signature", number: "01", name: "Signature", subtitle: "L’émotion, en grand.", personality: "Immersive · élégante · intemporelle",
    description: "Une maison de voyages qui laisse les images parler. Une présence discrète, des respirations généreuses et une élégance qui ne cherche pas à en faire trop.",
    recommended: true,
    palette: [{ name: "Forêt", value: "#163E31" }, { name: "Ivoire", value: "#F7F5ED" }, { name: "Céladon", value: "#DFEDB6" }, { name: "Bronze", value: "#A88D68" }],
    displayFont: "Cormorant Garamond", bodyFont: "DM Sans", typography: "Des titres en serif, des accents italiques et un texte de lecture très sobre.",
    composition: "Une ouverture cinématographique, des photographies grand format et des chapitres éditoriaux.",
    movements: ["Vidéo d’ouverture maîtrisée", "Chapitres photographiques superposés", "Révélations douces et survols discrets"],
    idealFor: "Valoriser les séjours personnalisés et donner une image haut de gamme, rassurante et durable.",
    watchpoint: "Conserver des images légères et des accès au voyage visibles, même dans une mise en scène immersive.",
  },
  {
    id: "terre-vivante", number: "02", name: "Terre vivante", subtitle: "Le Bénin, sans filtre.", personality: "Chaleureuse · culturelle · expressive",
    description: "Une identité plus affirmée, portée par les visages, la matière et les couleurs du pays. L’énergie du voyage prend autant de place que le paysage.",
    recommended: false,
    palette: [{ name: "Terre", value: "#A94F35" }, { name: "Sable", value: "#F1E7D4" }, { name: "Ébène", value: "#34271F" }, { name: "Safran", value: "#D7AC55" }],
    displayFont: "DM Sans · gras", bodyFont: "DM Sans", typography: "Des titres courts et affirmés, associés à quelques détails manuscrits en serif italique.",
    composition: "Des portraits, des cadrages asymétriques, des aplats terracotta et un graphisme original inspiré de la matière.",
    movements: ["Cartes photographiques décalées", "Transitions franches entre les chapitres", "Détails graphiques en mouvement léger"],
    idealFor: "Affirmer une personnalité locale mémorable et mettre la rencontre culturelle au premier plan.",
    watchpoint: "Doser les motifs et la couleur pour conserver la lisibilité et éviter une représentation folklorisante.",
  },
  {
    id: "ligne-claire", number: "03", name: "Ligne claire", subtitle: "Le voyage, simplement.", personality: "Lumineuse · précise · contemporaine",
    description: "Une interface qui va à l’essentiel. Les envies, les destinations et les prochaines étapes sont immédiatement compréhensibles, sans renoncer à l’émotion.",
    recommended: false,
    palette: [{ name: "Encre", value: "#203C38" }, { name: "Blanc", value: "#FFFFFF" }, { name: "Brume", value: "#EDF2EF" }, { name: "Sauge", value: "#A5BCAA" }],
    displayFont: "DM Sans · medium", bodyFont: "DM Sans", typography: "Une seule famille, des tailles nettes et une hiérarchie pensée pour la lecture sur mobile.",
    composition: "Une grille aérée, une recherche immédiatement disponible et des cartes faciles à parcourir.",
    movements: ["Transitions courtes et lisibles", "Retours d’action immédiats", "Vidéo disponible, jamais imposée"],
    idealFor: "Faire de la recherche de circuits et de la prise de contact les priorités du parcours.",
    watchpoint: "Garder une photographie et un ton éditorial distinctifs pour ne pas ressembler à un catalogue générique.",
  },
];

export type SavedDesignPreference = { direction: DesignDirectionId; notes: string; updatedAt: string };
export const DESIGN_STORAGE_KEY = "ayiffa.design-review.v1";

export function isDesignDirection(value: unknown): value is DesignDirectionId {
  return typeof value === "string" && designDirections.some(direction => direction.id === value);
}
export function isDesignReviewToken(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
export function getDesignDirection(id: DesignDirectionId) {
  return designDirections.find(direction => direction.id === id) || designDirections[0];
}
export function directionBrief(direction: DesignDirection) {
  return [
    `AYIFFA TOURISME : DIRECTION ${direction.number} : ${direction.name.toUpperCase()}`,
    "Inspiration de référence. Identité désormais appliquée : Signature × Terre vivante × Ligne claire.", "",
    direction.subtitle, direction.personality, "", direction.description, "",
    "PALETTE", ...direction.palette.map(color => `${color.name} : ${color.value}`), "",
    "TYPOGRAPHIE", `Titres : ${direction.displayFont}`, `Texte : ${direction.bodyFont}`, direction.typography, "",
    "COMPOSITION", direction.composition, "", "MOUVEMENTS", ...direction.movements.map(movement => `• ${movement}`), "",
    "POUR QUEL OBJECTIF ?", direction.idealFor, "", "POINT D’ATTENTION", direction.watchpoint, "",
    "L’export de cette fiche n’applique aucune modification au site. Les photographies sont celles de la sélection déjà créditée sur /credits.",
  ].join("\n");
}
