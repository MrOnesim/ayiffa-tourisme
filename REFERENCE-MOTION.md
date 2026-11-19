# AYIFFA — adaptation des principes de Visit Ghana

## Référence examinée

URL : https://visitghana.com/

Audit de la page publique dans un navigateur Chromium à 1440 × 900, avec défilement réel et captures des sections. Le code de la page et les styles calculés ont été observés pour identifier les mécanismes, sans réutilisation de son code, de ses textes de marque ou de ses médias.

### Comportements effectivement observés

- Une composition de photographies qui se chevauchent en éventail sous l’introduction.
- Quatre grands panneaux « EAT / WEAR / SEE / FEEL GHANA », en position sticky, de l’ordre de 500 px de hauteur, qui se recouvrent au défilement.
- Des images en diaporama avec transitions en fondu et mouvements de zoom lents (classes Ken Burns observées dans le navigateur).
- Des catégories de découverte regroupées sous des onglets.
- Une navigation qui se condense lors du défilement et des rubans de texte en bas de page.

La référence charge notamment GSAP, ScrollTrigger, Swiper, Jarallax, Locomotive Scroll et Elementor. Leur présence ne signifie pas que chaque fonction est utilisée à tout moment. Le fond vidéo YouTube déclaré dans la page n’a pas été restitué dans le navigateur d’audit ; son rendu vidéo exact n’a donc pas été évalué.

## Transposition recommandée pour AYIFFA

1. **Un éventail de départs** : cartes photographiques qui s’écartent avec le défilement et se redressent au survol ou au focus. Sur petit écran, défilement horizontal natif avec ancrage et commandes précédant/suivant.
2. **Quatre chapitres immersifs** : rencontrer, explorer les eaux, comprendre l’histoire et ralentir. Panneaux photographiques qui se superposent, avec une très légère profondeur pour le panneau précédent.
3. **Un accès direct aux chapitres** : navigation persistante dans la section, indication du chapitre courant et liens réels vers destinations et circuits.
4. **Des images vivantes, mais maîtrisées** : fondus et zooms uniquement sur le chapitre actif, pause explicite, arrêt hors écran et respect de prefers-reduced-motion.
5. **Une variante tactile** : pas d’empilement qui bloque un petit écran ; cartes lisibles et balayage horizontal naturel. Aucun détournement de la molette ou du défilement vertical.

Les photographies du projet restent celles déjà créditées sur /credits. Aucun visuel, logo, texte commercial ou script de Visit Ghana n’est intégré au site AYIFFA. Le carnet vidéo local, la recherche, les circuits et les demandes enregistrées via Drizzle/PostgreSQL sont conservés.

## Implémentation

- `src/components/destination-fan.tsx` : éventail au scroll, cartes redressées au survol/focus, rail tactile avec scroll-snap et commandes.
- `src/components/experience-showcase.tsx` : quatre scènes superposées, navigation par ancres, détection du chapitre actif, mode tactile et commande pause des photographies.
- `src/lib/journey.ts` : textes éditoriaux, liens et légendes centralisés. Les lieux réels des photographies et les images d’ambiance restent identifiés.
- `src/app/visit-inspired.css` : couche visuelle indépendante de la charte existante.
- `tests/visit-inspired.spec.ts` : contrôles de l’éventail, des positions sticky, de la profondeur, du rail mobile, de la pause et du clavier.

L’empilement est réservé aux écrans d’au moins 901 px de large et 700 px de haut sans préférence de mouvement réduit. Sur mobile, les cartes se parcourent horizontalement sans détourner le scroll vertical. En mouvement réduit, la présentation est statique et les photos ne changent pas automatiquement. Les scènes utilisent une animation de zoom sur la seule photo active ; le diaporama est suspendu hors de la section, quand l’onglet est masqué et lorsque le lecteur cinéma est ouvert. Sur mobile, un changement explicite de chapitre recadre la scène sous l’en-tête ; un balayage natif laisse le défilement vertical entièrement libre.

Aucune dépendance npm ajoutée, aucun changement de schéma PostgreSQL et aucune donnée de production touchée.
