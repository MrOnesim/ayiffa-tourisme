# Atelier de propositions frontend AYIFFA

> Mise à jour : la combinaison recommandée est désormais appliquée aux pages publiques de la préversion. L’atelier conserve les trois inspirations comme références. Voir `APPLIED-IDENTITY.md` pour le périmètre exact et les composants concernés.

## Périmètre

Page indépendante : `/directions-artistiques`, accessible depuis « Studio » dans l’en-tête large, le menu mobile et le pied de page. Elle ne remplace pas l’accueil actuel et n’est pas incluse dans le sitemap. Ses métadonnées imposent `noindex, nofollow`, même si l’indexation du site est activée.

Trois propositions distinctes :
1. **Signature** (recommandation) — forêt, ivoire, céladon, serif élégant, couverture cinématographique.
2. **Terre vivante** — terracotta, sable, ébène, grands titres sans serif, collage photographique et géométrie originale.
3. **Ligne claire** — blanc, sauge, grille aérée, recherche immédiatement disponible, hiérarchie simple.

Les aperçus ont une navigation réelle vers les pages existantes, le lecteur vidéo de la refonte et, pour Ligne claire, une recherche GET fonctionnelle. Les liens ouvrent la version actuelle du site ; il ne s’agit pas de trois thèmes appliqués aux pages publiques.

## Fonctions de présentation

- Onglets utilisables au clavier (flèches, Début, Fin).
- Aperçus large/mobile, responsive à la largeur du cadre.
- Pause des animations, respect de prefers-reduced-motion ; arrêt de l’animation derrière le comparatif et le film.
- Palettes copiables, lien partageable ne contenant aucune note privée.
- Export d’une fiche texte réelle pour la direction sélectionnée.
- Tableau comparatif accessible, sans scores de performance ni promesses de conversion inventés.
- Recommandation éditoriale : Signature, avec quelques accents terracotta sans mélanger les architectures.

## Préférences enregistrées

API : `/api/preferences-design` (GET, POST et DELETE).

Le premier enregistrement crée une clé UUID v4 aléatoire conservée dans `localStorage` sous `ayiffa.design-review.v1`. Elle est envoyée dans l’en-tête Authorization, jamais dans le lien partageable. Le serveur conserve uniquement son SHA-256 dans la table `ayiffa_design_preferences`, ainsi que la direction, une note facultative de 800 caractères maximum et les dates.

Une même clé est mise à jour par upsert, sans multiplier les enregistrements. Aucun endpoint de liste publique. GET et DELETE ne concernent que la clé présentée. Les réponses sont privées et non mises en cache. Validation de la direction, des types, du volume, de la clé, du piège anti-robot et des requêtes cross-site. Les valeurs de notes et clés ne sont pas journalisées.

Enregistrer une préférence n’applique aucun design, ne réserve aucun voyage et n’envoie aucun e-mail à l’agence. Un bouton permet de supprimer cette préférence depuis le même navigateur. La politique de confidentialité décrit ce stockage de présentation. Sans stockage local, la clé ne reste disponible que pendant la visite courante, avec un avertissement.

Cette fonction n’est ni un espace d’administration ni un système d’identité. Avant une utilisation publique en production, valider les règles de conservation, ajouter la protection anti-abus de l’hébergement et, si nécessaire, remplacer les clés anonymes par un espace client authentifié.

## Architecture et mise en route

- `src/lib/design-directions.ts` : données éditoriales, palettes, types et export de fiche.
- `src/components/design/` : atelier, aperçus, comparaison, préférences.
- `src/app/directions-artistiques/studio.css` : styles isolés, sans rethémer le site actuel.
- `src/db/schema.ts` : nouvelle table ajoutée sans modifier `ayiffa_travel_requests`.
- Après préparation de l’environnement : `npx drizzle-kit push` sur la base indépendante uniquement.

Aucune dépendance npm, aucune photographie externe ni nouvelle police ajoutée. Les images et le film proviennent de la sélection existante, créditée sur `/credits`. Les demandes de voyage et données de production restent séparées de cette page de présentation.
