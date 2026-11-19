# AYIFFA — identité appliquée

## Décision

La demande « Applique tout » est mise en œuvre comme une identité cohérente, pas comme trois thèmes contradictoires alternant selon les pages.

**Signature** reste la base : vert profond, ivoire, Cormorant Garamond, grandes images, vidéo locale et composition éditoriale.

**Terre vivante** apporte les accents terracotta, la présence des portraits, le collage culturel et le chapitre typographique « Vivre. Le Bénin. Vraiment. ».

**Ligne claire** structure les actions : recherche immédiatement identifiable, raccourcis d’envies, catalogues et filtres lisibles, fiches homogènes et formulaire regroupé en trois parties.

## Application effective

Le document racine porte `data-design="signature-terre-claire"`. Le socle est défini dans `src/lib/applied-identity.ts` et appliqué par `src/app/signature.css` sur toutes les pages publiques. Il ne dépend pas d’une préférence locale de navigateur et reste identique après rechargement.

- Accueil : nouvelle composition Signature, actions terracotta, lecteur circulaire, recherche clarifiée et section Terre vivante réelle.
- Destinations et circuits : filtres, cartes, métadonnées et boutons harmonisés.
- Fiches détaillées : typographie, encarts de préparation et notices cohérents.
- Services, À propos, galerie et pages légales : même palette et meilleure lisibilité des textes.
- Contact : formulaire intégralement visible en trois groupes (coordonnées, voyage, envies), validations conservées, récapitulatif après confirmation.
- Navigation et footer : priorité au voyage ; l’atelier demeure accessible comme référence secondaire.

L’éventail, les chapitres photographiques superposés, les rails tactiles et le film de 22 secondes sont conservés. Les animations respectent toujours les préférences de mouvement réduit.

## Atelier de référence

`/directions-artistiques` affiche désormais une confirmation de l’identité appliquée. Les trois aperçus sont conservés comme inspirations de départ, avec comparaison, export et avis modifiables. Leur enregistrement n’applique pas automatiquement un autre thème.

Les préférences existantes ne sont pas réécrites. Aucune migration de schéma n’est nécessaire pour cette application graphique.

## Périmètre et transparence

L’application concerne la préversion indépendante. Aucun accès à l’ancien panneau d’administration, aucune modification du DNS, aucun écrasement du site historique et aucune donnée de production modifiée.

L’API de demandes continue d’enregistrer dans la base indépendante. Le formulaire et sa confirmation indiquent toujours qu’un envoi automatique à l’agence n’est pas configuré. Le client peut transmettre son récapitulatif par e-mail ou WhatsApp. Aucun prix, disponibilité, témoignage ou service non confirmé n’a été ajouté.

Aucune dépendance npm, police ou photographie externe supplémentaire. Les crédits existants s’appliquent aux images et au film utilisés.
