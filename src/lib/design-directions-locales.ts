import type { Locale } from "./i18n";
import { getDictionary } from "./get-dictionary";
import { designDirections, type DesignDirection, type DesignDirectionId } from "./design-directions";

type DirectionKey = "signature" | "terreVivante" | "ligneClaire";

export function directionKey(id: DesignDirectionId): DirectionKey {
  if (id === "terre-vivante") return "terreVivante";
  if (id === "ligne-claire") return "ligneClaire";
  return "signature";
}

export function getLocalizedDesignDirections(locale: Locale): DesignDirection[] {
  const texts = getDictionary(locale).studio.directions;
  return designDirections.map(direction => {
    const text = texts[directionKey(direction.id)];
    return {
      ...direction,
      name: text.name,
      subtitle: text.subtitle,
      personality: text.personality,
      description: text.description,
      palette: direction.palette.map((color, index) => ({ ...color, name: text.palette[index] ?? color.name })),
      typography: text.typography,
      composition: text.composition,
      movements: text.movements,
      idealFor: text.idealFor,
      watchpoint: text.watchpoint,
    };
  });
}

export function getLocalizedDesignDirection(id: DesignDirectionId, locale: Locale): DesignDirection {
  const directions = getLocalizedDesignDirections(locale);
  return directions.find(direction => direction.id === id) || directions[0];
}

export function getLocalizedDirectionBrief(direction: DesignDirection, locale: Locale) {
  const studio = getDictionary(locale).studio;
  return [
    `AYIFFA · ${direction.number} · ${direction.name.toUpperCase()}`,
    studio.briefKicker, "",
    direction.subtitle, direction.personality, "", direction.description, "",
    studio.palette.toUpperCase(), ...direction.palette.map(color => `${color.name} : ${color.value}`), "",
    studio.typography.toUpperCase(), `${studio.briefTitles} : ${direction.displayFont}`, `${studio.briefBody} : ${direction.bodyFont}`, direction.typography, "",
    studio.composition, direction.composition, "",
    studio.movement.toUpperCase(), ...direction.movements.map(movement => `• ${movement}`), "",
    studio.idealFor.toUpperCase(), direction.idealFor, "", studio.watchpoint.toUpperCase(), direction.watchpoint, "",
    studio.briefExportNote,
  ].join("\n");
}
