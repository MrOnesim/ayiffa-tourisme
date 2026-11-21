import type { Locale } from "./i18n";
import { journeyChapters, departurePostcards } from "./journey";
import { atlasStops, type AtlasStop } from "./atlas";
import { beninFilm } from "./film";

type Translation = Exclude<Locale, "fr">;

type JourneyText = {
  shortLabel: string; navigationLabel: string; eyebrow: string; verb: string; line: string;
  description: string; action: string; photoAlts: string[]; captions: string[];
};

const journeyText: Record<Translation, JourneyText[]> = {
  en: [
    {
      shortLabel: "Meet", navigationLabel: "Meet a living culture", eyebrow: "LIVING CULTURES", verb: "Meet.", line: "Another point of view.",
      description: "Listen to a guide's stories, understand the places and their traditions. The best of Benin often begins with an encounter.",
      action: "At the heart of the cultures",
      photoAlts: ["Traditional ceremony in Abomey-Calavi, Benin", "Aerial view of the city of Ouidah and its heritage"],
      captions: ["Abomey-Calavi · Benin", "Ouidah · Benin"],
    },
    {
      shortLabel: "Explore", navigationLabel: "Follow the rhythm of the water", eyebrow: "PIROGUES & LAGOONS", verb: "Explore.", line: "At the rhythm of the water.",
      description: "In Ganvié, paths are made of water. A pirogue, a landscape, a singular way of inhabiting the lake and discovering Benin.",
      action: "Discover Ganvié",
      photoAlts: ["Aerial view of Ganvié with its stilt houses and pirogues", "Stilt houses and pirogues in the heart of Ganvié"],
      captions: ["Ganvié · Lake Nokoué", "Ganvié · Lake life"],
    },
    {
      shortLabel: "Understand", navigationLabel: "Understand the stories of Ouidah", eyebrow: "HISTORY & HERITAGE", verb: "Remember.", line: "To understand better.",
      description: "In Ouidah, history invites you to listen. A sensitive discovery of memorial sites and stories passed down through generations.",
      action: "The paths of memory",
      photoAlts: ["Aerial view of the coast and landscape of Ouidah"],
      captions: ["Ouidah · Atlantic Coast"],
    },
    {
      shortLabel: "Slow down", navigationLabel: "Give yourself the luxury of slowing down", eyebrow: "THE LUXURY OF TIME", verb: "Slow down.", line: "Simply.",
      description: "The breath of the Atlantic, the lights of Grand-Popo. And the quiet pleasure of having nothing to rush.",
      action: "Find the horizon again",
      photoAlts: ["Aerial view of the beach and coconut trees of Grand-Popo", "Palm trees and parasols on the beach near Ouidah"],
      captions: ["Grand-Popo · Atlantic Ocean", "Atlantic Coast · Benin"],
    },
  ],
  es: [
    {
      shortLabel: "Encontrar", navigationLabel: "Conocer una cultura viva", eyebrow: "CULTURAS VIVAS", verb: "Encontrar.", line: "Otra mirada.",
      description: "Escuchar los relatos de un guía, comprender los lugares y sus tradiciones. Lo mejor de Benín suele empezar con un encuentro.",
      action: "En el corazón de las culturas",
      photoAlts: ["Ceremonia tradicional en Abomey-Calavi, Benín", "Vista aérea de la ciudad de Ouidah y su patrimonio"],
      captions: ["Abomey-Calavi · Benín", "Ouidah · Benín"],
    },
    {
      shortLabel: "Explorar", navigationLabel: "Seguir el ritmo del agua", eyebrow: "PIRAGUAS Y LAGUNAS", verb: "Explorar.", line: "Al ritmo del agua.",
      description: "En Ganvié, los caminos son de agua. Una piragua, un paisaje, una forma singular de habitar el lago y descubrir Benín.",
      action: "Descubrir Ganvié",
      photoAlts: ["Vista aérea de Ganvié con sus casas sobre pilotes y piraguas", "Casas sobre pilotes y piraguas en el corazón de Ganvié"],
      captions: ["Ganvié · Lago Nokoué", "Ganvié · Vida lacustre"],
    },
    {
      shortLabel: "Comprender", navigationLabel: "Comprender las historias de Ouidah", eyebrow: "HISTORIA Y PATRIMONIO", verb: "Recordar.", line: "Para comprender mejor.",
      description: "En Ouidah, la historia invita a escuchar. Un descubrimiento sensible de los lugares de memoria y de los relatos que atraviesan generaciones.",
      action: "Los caminos de la memoria",
      photoAlts: ["Vista aérea de la costa y el paisaje de Ouidah"],
      captions: ["Ouidah · Costa Atlántica"],
    },
    {
      shortLabel: "Ralentizar", navigationLabel: "Darte el lujo de bajar el ritmo", eyebrow: "EL LUJO DEL TIEMPO", verb: "Ralentizar.", line: "Sin más.",
      description: "El soplo del Atlántico, las luces de Grand-Popo. Y el placer discreto de no tener nada que apresurar.",
      action: "Reencontrar el horizonte",
      photoAlts: ["Vista aérea de la playa y los cocoteros de Grand-Popo", "Palmeras y sombrillas en la playa cerca de Ouidah"],
      captions: ["Grand-Popo · Océano Atlántico", "Costa Atlántica · Benín"],
    },
  ],
  de: [
    {
      shortLabel: "Begegnen", navigationLabel: "Eine lebendige Kultur kennenlernen", eyebrow: "LEBENDIGE KULTUREN", verb: "Begegnen.", line: "Ein anderer Blick.",
      description: "Den Erzählungen eines Guides lauschen, Orte und ihre Traditionen verstehen. Das Beste Benins beginnt oft mit einer Begegnung.",
      action: "Im Herzen der Kulturen",
      photoAlts: ["Traditionelle Zeremonie in Abomey-Calavi, Benin", "Luftaufnahme der Stadt Ouidah und ihres Erbes"],
      captions: ["Abomey-Calavi · Benin", "Ouidah · Benin"],
    },
    {
      shortLabel: "Entdecken", navigationLabel: "Dem Rhythmus des Wassers folgen", eyebrow: "PIROGEN & LAGUNEN", verb: "Entdecken.", line: "Im Rhythmus des Wassers.",
      description: "In Ganvié sind Wege aus Wasser. Eine Piroge, eine Landschaft, eine eigene Art, den See zu bewohnen und Benin zu entdecken.",
      action: "Ganvié entdecken",
      photoAlts: ["Luftaufnahme von Ganvié mit Pfahlbauten und Pirogen", "Pfahlbauten und Pirogen mitten in Ganvié"],
      captions: ["Ganvié · Nokoué-See", "Ganvié · Leben am See"],
    },
    {
      shortLabel: "Verstehen", navigationLabel: "Die Geschichten von Ouidah verstehen", eyebrow: "GESCHICHTE & ERBE", verb: "Erinnern.", line: "Zum besseren Verstehen.",
      description: "In Ouidah lädt die Geschichte zum Zuhören ein. Eine behutsame Entdeckung der Erinnerungsorte und der Erzählungen über Generationen hinweg.",
      action: "Die Wege der Erinnerung",
      photoAlts: ["Luftaufnahme der Küste und Landschaft von Ouidah"],
      captions: ["Ouidah · Atlantikküste"],
    },
    {
      shortLabel: "Langsam", navigationLabel: "Sich den Luxus der Langsamkeit gönnen", eyebrow: "DER LUXUS DER ZEIT", verb: "Langsam.", line: "Einfach so.",
      description: "Der Atem des Atlantiks, das Licht von Grand-Popo. Und die stille Freude, nichts eilen zu müssen.",
      action: "Den Horizont wiederfinden",
      photoAlts: ["Luftaufnahme des Strands und der Kokospalmen von Grand-Popo", "Palmen und Sonnenschirme am Strand bei Ouidah"],
      captions: ["Grand-Popo · Atlantischer Ozean", "Atlantikküste · Benin"],
    },
  ],
};

export function getLocalizedJourney(locale: Locale) {
  if (locale === "fr") return journeyChapters;
  const texts = journeyText[locale];
  return journeyChapters.map((chapter, index) => {
    const text = texts[index];
    return {
      ...chapter,
      shortLabel: text.shortLabel,
      navigationLabel: text.navigationLabel,
      eyebrow: text.eyebrow,
      verb: text.verb,
      line: text.line,
      description: text.description,
      action: text.action,
      photos: chapter.photos.map((photo, photoIndex) => ({
        ...photo,
        alt: text.photoAlts[photoIndex] ?? photo.alt,
        caption: text.captions[photoIndex] ?? photo.caption,
      })),
    };
  });
}

type PostcardText = { title: string; label: string; alt: string; note: string };
const postcardText: Record<Translation, PostcardText[]> = {
  en: [
    { title: "Ouidah", label: "MEMORY & CULTURE", alt: "Ouidah seen from the sky with its urban heritage", note: "Ouidah · Benin" },
    { title: "Ganvié", label: "ON THE WATER", alt: "Ganvié seen from the sky with its stilt houses", note: "Lake Nokoué · Benin" },
    { title: "Encounters", label: "LIVING BENIN", alt: "A traditional ceremony in Abomey-Calavi", note: "Abomey-Calavi · Benin" },
    { title: "Grand-Popo", label: "THE ART OF SLOWING DOWN", alt: "Coconut palms and parasols on the beach of Grand-Popo", note: "Grand-Popo · Benin" },
    { title: "The lagoons", label: "NATURE & ENCOUNTERS", alt: "Stilt houses and pirogues on Lake Nokoué", note: "Ganvié · Lake Nokoué" },
  ],
  es: [
    { title: "Ouidah", label: "MEMORIA Y CULTURA", alt: "Ouidah vista desde el cielo con su patrimonio urbano", note: "Ouidah · Benín" },
    { title: "Ganvié", label: "AL FIL DEL AGUA", alt: "Ganvié vista desde el cielo con sus casas sobre pilotes", note: "Lago Nokoué · Benín" },
    { title: "Los encuentros", label: "EL BENÍN VIVO", alt: "Una ceremonia tradicional en Abomey-Calavi", note: "Abomey-Calavi · Benín" },
    { title: "Grand-Popo", label: "EL ARTE DE IR DESPACIO", alt: "Cocoteros y sombrillas en la playa de Grand-Popo", note: "Grand-Popo · Benín" },
    { title: "Las lagunas", label: "NATURALEZA Y ENCUENTROS", alt: "Casas sobre pilotes y piraguas en el lago Nokoué", note: "Ganvié · Lago Nokoué" },
  ],
  de: [
    { title: "Ouidah", label: "ERINNERUNG & KULTUR", alt: "Ouidah aus der Luft mit seinem urbanen Erbe", note: "Ouidah · Benin" },
    { title: "Ganvié", label: "AM WASSER", alt: "Ganvié aus der Luft mit seinen Pfahlbauten", note: "Nokoué-See · Benin" },
    { title: "Begegnungen", label: "DAS LEBENDIGE BENIN", alt: "Eine traditionelle Zeremonie in Abomey-Calavi", note: "Abomey-Calavi · Benin" },
    { title: "Grand-Popo", label: "DIE KUNST DES LANGSAMSEINS", alt: "Kokospalmen und Sonnenschirme am Strand von Grand-Popo", note: "Grand-Popo · Benin" },
    { title: "Die Lagunen", label: "NATUR & BEGEGNUNGEN", alt: "Pfahlbauten und Pirogen auf dem Nokoué-See", note: "Ganvié · Nokoué-See" },
  ],
};

export function getLocalizedPostcards(locale: Locale) {
  if (locale === "fr") return departurePostcards;
  const texts = postcardText[locale];
  return departurePostcards.map((card, index) => ({ ...card, ...texts[index] }));
}

type StopText = { name: string; shortName: string; region: string; category: string; description: string };
const stopText: Record<Translation, StopText[]> = {
  en: [
    { name: "Ganvié", shortName: "Ganvié", region: "Lake Nokoué", category: "On the water", description: "A water landscape, pirogues and the art of living at the rhythm of the lake." },
    { name: "Ouidah", shortName: "Ouidah", region: "Atlantique", category: "Culture & heritage", description: "Memory, traditions and our home base, beside the ocean." },
    { name: "Grand-Popo", shortName: "Grand-Popo", region: "Mono", category: "Escape & nature", description: "Meet the ocean, the lagoons and the gentleness of the coastline." },
    { name: "Lake Ahémé", shortName: "Lake Ahémé", region: "Southern Benin", category: "On the water", description: "Mangroves, local know-how and encounters close to the water." },
    { name: "The hills of Savè", shortName: "Savè", region: "Collines · Savè", category: "Escape & nature", description: "Another landscape, another perspective on the country." },
  ],
  es: [
    { name: "Ganvié", shortName: "Ganvié", region: "Lago Nokoué", category: "Al filo del agua", description: "Un paisaje de agua, piraguas y el arte de vivir al ritmo del lago." },
    { name: "Ouidah", shortName: "Ouidah", region: "Atlántico", category: "Cultura y patrimonio", description: "La memoria, las tradiciones y nuestro punto de partida, junto al océano." },
    { name: "Grand-Popo", shortName: "Grand-Popo", region: "Mono", category: "Naturaleza y escapada", description: "Encontrar el océano, las lagunas y la dulzura de la costa." },
    { name: "Lago Ahémé", shortName: "Lago Ahémé", region: "Sur de Benín", category: "Al filo del agua", description: "Manglares, saberes locales y encuentros junto al agua." },
    { name: "Las colinas de Savè", shortName: "Savè", region: "Collines · Savè", category: "Naturaleza y escapada", description: "Otro relieve, otra perspectiva del país." },
  ],
  de: [
    { name: "Ganvié", shortName: "Ganvié", region: "Nokoué-See", category: "Am Wasser", description: "Eine Wasserlandschaft, Pirogen und die Kunst, im Rhythmus des Sees zu leben." },
    { name: "Ouidah", shortName: "Ouidah", region: "Atlantique", category: "Kultur & Erbe", description: "Erinnerung, Traditionen und unser Ausgangspunkt am Ozean." },
    { name: "Grand-Popo", shortName: "Grand-Popo", region: "Mono", category: "Natur & Erholung", description: "Den Ozean, die Lagunen und die Sanftheit der Küste entdecken." },
    { name: "Ahémé-See", shortName: "Ahémé-See", region: "Südbenin", category: "Am Wasser", description: "Mangroven, lokales Wissen und Begegnungen ganz nah am Wasser." },
    { name: "Die Hügel von Savè", shortName: "Savè", region: "Collines · Savè", category: "Natur & Erholung", description: "Eine andere Landschaft, ein anderer Blick auf das Land." },
  ],
};

export function getLocalizedAtlasStops(locale: Locale): AtlasStop[] {
  if (locale === "fr") return atlasStops;
  const texts = stopText[locale];
  return atlasStops.map((stop, index) => ({ ...stop, ...texts[index] }));
}

type FilmText = {
  captions: string;
  title: string; subtitle: string; description: string;
  chapters: { title: string; location: string }[];
  sources: { type: string }[];
};
const filmText: Record<Translation, FilmText> = {
  en: {
    captions: "/videos/benin-carnet-en.vtt",
    title: "Benin, intensely", subtitle: "A visual notebook by AYIFFA",
    description: "A silent montage of animated photographs of Ganvié and a real aerial sequence of Ouidah. Water landscapes, a city in motion, another idea of Benin.",
    chapters: [
      { title: "Along the water", location: "Ganvié" },
      { title: "Change your perspective", location: "Ouidah" },
      { title: "Back to essentials", location: "Lake Nokoué" },
    ],
    sources: [
      { type: "Photograph of Ganvié" },
      { type: "Aerial sequence of the historic city of Ouidah" },
      { type: "Photograph of Lake Nokoué" },
    ],
  },
  es: {
    captions: "/videos/benin-carnet-es.vtt",
    title: "Benín, intensamente", subtitle: "Un cuaderno visual de AYIFFA",
    description: "Un montaje sin sonido de fotografías animadas de Ganvié y una secuencia aérea real de Ouidah. Paisajes de agua, una ciudad en movimiento, otra forma de ver Benín.",
    chapters: [
      { title: "Al filo del agua", location: "Ganvié" },
      { title: "Cambiar de mirada", location: "Ouidah" },
      { title: "Volver a lo esencial", location: "Lago Nokoué" },
    ],
    sources: [
      { type: "Fotografía de Ganvié" },
      { type: "Secuencia aérea de la ciudad histórica de Ouidah" },
      { type: "Fotografía del lago Nokoué" },
    ],
  },
  de: {
    captions: "/videos/benin-carnet-de.vtt",
    title: "Benin, intensiv", subtitle: "Ein visuelles Notebook von AYIFFA",
    description: "Ein stummer Schnitt aus animierten Fotografien von Ganvié und einer echten Luftaufnahme von Ouidah. Wasserlandschaften, eine Stadt in Bewegung, eine andere Art, Benin zu sehen.",
    chapters: [
      { title: "Am Wasser entlang", location: "Ganvié" },
      { title: "Den Blick wechseln", location: "Ouidah" },
      { title: "Zurück zum Wesentlichen", location: "Nokoué-See" },
    ],
    sources: [
      { type: "Fotografie von Ganvié" },
      { type: "Luftaufnahme der historischen Stadt Ouidah" },
      { type: "Fotografie des Nokoué-Sees" },
    ],
  },
};

export function getLocalizedFilm(locale: Locale) {
  if (locale === "fr") return { ...beninFilm, captionsLang: "fr" as const };
  const text = filmText[locale];
  return {
    ...beninFilm,
    captions: text.captions,
    captionsLang: locale,
    title: text.title,
    subtitle: text.subtitle,
    description: text.description,
    chapters: beninFilm.chapters.map((chapter, index) => ({ ...chapter, ...text.chapters[index] })),
    sources: beninFilm.sources.map((source, index) => ({ ...source, ...text.sources[index] })),
  };
}
