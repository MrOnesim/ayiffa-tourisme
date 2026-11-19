# AYIFFA TOURISME — dossier de refonte

> Identité appliquée : la préversion utilise maintenant la synthèse Signature × Terre vivante × Ligne claire sur toutes ses pages publiques. Le périmètre, la palette, les composants et les garanties de séparation avec le site historique sont documentés dans `APPLIED-IDENTITY.md`. L’atelier conserve les inspirations comme références et ne remplace pas automatiquement la charte selon une préférence enregistrée.

## Périmètre et indépendance

Application Next.js App Router / React / TypeScript, PostgreSQL via Drizzle. Aucun identifiant de l'ancien site n'est utilisé ; aucune donnée ni ressource de production n'a été modifiée. Le mot-symbole et le monogramme sont une proposition graphique nouvelle, pas une reproduction certifiée du logo historique.

Pages : accueil, destinations + 6 détails, circuits + 4 détails, expériences, services, à propos, contact, galerie, crédits, mentions légales et confidentialité. Navigation mobile native `dialog`, recherche/filtrage, tri des circuits, carrousel manuel, éventail de photographies interactif, chapitres d’expériences superposés au défilement et parcours tactile, galerie avec clavier, formulaires accessibles et confirmation persistée. Les effets adaptés après observation de Visit Ghana sont documentés dans `REFERENCE-MOTION.md` ; aucun média ni script de la référence n’est utilisé sur le site.

## Audit des sources publiques

L'accès HTTP direct à l'ancien site a échoué pendant l'audit. Les pages indexées ont permis de rapprocher :
- https://ayiffatourisme.com/ : Ouidah, Grand-Popo, Ganvié, Adjarra, lac Ahémé, Savè ; circuits de 8 et 10 jours ; Route des Esclaves sur une journée.
- https://ayiffatourisme.com/about.php : équipe de guides, séjours sur mesure, découverte locale, temps du voyageur.
- https://ayiffatourisme.com/demander-un-devis.php : Ouidah / Atlantique / Bénin ; contact@ayiffatourisme.com ; +229 67045407.
- http://ayiffatourisme.com/visiter-detour-par-gogotinkpon.php : immersion écologique, pirogue, mangrove, découvertes et dégustations locales.
- https://ayiffatourisme.com/visiter-la-bouche-du-roi-grand-popo.php : excursion Gogotinkpon d'une journée.

Le téléphone affiché est normalisé +229 01 67 04 54 07, suivant le plan béninois à dix chiffres en vigueur depuis le 30 novembre 2024. La propriété actuelle de la ligne et l'activation WhatsApp ne sont pas confirmées : avertissement explicite sur Contact et dans les mentions légales.

Éléments exclus volontairement : fausses destinations internationales du template historique, compteurs, étoiles/avis non vérifiables, dates de fondation, certifications, prix et prestations non confirmés. Les transports/aérien/hôtels/location apparaissent comme liens dans l'ancien menu mais ne suffisent pas à attester une prestation commercialisée : ils ne sont pas présentés comme services confirmés. Aucun faux témoignage. La section voyageurs invite à fournir un témoignage autorisé.

Le format 10 jours nord-sud est identifié comme historique et sa faisabilité est expressément conditionnelle aux avis officiels et à la sécurité. Aucun safari/accès à la Pendjari n'est promis.

## Photographies et licences

Toutes les images effectivement affichées sont photographiées au Bénin. Aucune image générée. `/credits` liste les photographes, originaux, licences et transformations. Les images de Ganvié sont de Kenza Loussouarn ; Ouidah d'Adedoyin ADEROMOLA ; culture d'Abdias GBETOKPANOU ; Dassa d'Anthony Desrochers (Pexels). Littoral de Grand-Popo : Fawaz.tairou (CC BY-SA 4.0). Lagune et hamacs à Grand-Popo : Heikki Kastemaa / Kulttuurinavigaattori (CC BY-SA 4.0). Les adaptations des photographies CC BY-SA restent sous cette licence. Les visuels d'ambiance représentant une autre localité sont signalés sur les fiches et circuits.

Les polices locales DM Sans et Cormorant Garamond sont sous SIL OFL, textes dans public/fonts. Lucide : ISC. Images servies via Next Image, dimensions adaptatives et chargement différé ; couverture préchargée. Les effets CSS et IntersectionObserver respectent prefers-reduced-motion. Pas de bibliothèque d'animation lourde ni de traqueur.

## Demandes de voyage : fonctionnement réel

POST /api/demandes valide les champs côté serveur, refuse les requêtes cross-site et les corps non JSON/volumineux, utilise un honeypot et limite à cinq créations par e-mail et par heure. La clé UUID unique rend les répétitions d'une même soumission idempotentes. Les données sont enregistrées dans `ayiffa_travel_requests` avec une référence AYF-XXXXXXXX.

Le formulaire annonce avant la soumission que cette version est indépendante. Après confirmation, il précise que la demande est enregistrée mais **non envoyée automatiquement à l'agence**. E-mail/WhatsApp permettent au visiteur de transmettre lui-même un récapitulatif ; copie presse-papiers disponible. Il n'y a ni paiement, ni contrat, ni réservation de disponibilité, ni confirmation d'e-mail envoyé.

Aucune route publique de lecture des demandes et aucun écran d'administration ouvert. L'accès à la base doit rester réservé à l'opérateur autorisé. Avant de collecter des données en production : authentifier l'espace de traitement, valider responsable/hébergement, définir et implémenter purge/rétention, ajouter une protection anti-abus au niveau de l'hébergeur et reconnecter les notifications.

## Configuration et mise en route

Variables :
- DATABASE_URL : connexion PostgreSQL existante (serveur seulement).
- NEXT_PUBLIC_SITE_URL : URL canonique finale ; valeur par défaut https://www.ayiffatourisme.com.
- SITE_INDEXABLE=true : active l'indexation de la version publiée. Par défaut, metadata noindex et robots interdisent le crawl, pour éviter une concurrence avec le site en production.

Schéma : `src/db/schema.ts`. Appliquer par `npx drizzle-kit push` après initialisation de l'environnement. Ne jamais pointer cette commande sur la base historique sans sauvegarde, revue et accord explicite.

Validation : `npx next typegen`, `npm exec tsc -- --noEmit --pretty false`, `npm run build`, puis démarrage géré par la plateforme et vérification `/api/health`.

## Accès / validations nécessaires avant raccordement officiel

1. Accord éditorial : destinations actives, itinéraires, saisons, disponibilités, inclusions, prix et zones accessibles.
2. Logo officiel vectoriel et charte si la signature proposée doit être remplacée ; portraits autorisés, historique et témoignages réels.
3. Validation du téléphone, du compte WhatsApp et du fonctionnement de la boîte contact@ayiffatourisme.com.
4. Documentation ou accès sécurisé à l'ancien backend/CRM et export de contenu en lecture seule. Aucune hypothèse de connexion actuelle.
5. Fournisseur d'e-mail transactionnel et accès DNS limités pour SPF/DKIM, ou webhook CRM documenté. Les secrets resteront côté serveur, jamais dans le frontend.
6. Identité juridique, immatriculation, responsable de publication et de traitement, hébergeur, conditions commerciales, politique de rétention et procédure de suppression.
7. Domaine/DNS, hébergement, monitoring, sauvegarde/restauration, validation de sécurité et consentement avant mise en ligne.
8. Plan de redirections des anciennes URLs .php vers les nouvelles pages, à finaliser après inventaire réel. Aucun remplacement de domaine ni écrasement automatique n'est effectué.

Le code de présentation est exploitable indépendamment. Les pages de détail ont des métadonnées propres, canonical, Open Graph, un sitemap et des données structurées TravelAgency sans avis ni tarification fictifs.

## Édition cinématographique — vidéo et mouvement

La couverture a été recomposée en plein écran avec une navigation transparente qui devient ivoire au défilement, une progression de lecture, des titres révélés mot par mot, des boutons magnétiques, des cartes inclinables, un ruban typographique pausable et une section cinéma dédiée. Le lecteur modal natif est partagé entre l’en-tête, le hero et la section vidéo. Il dispose d’une fermeture clavier, du retour du focus, de commandes de lecture, du plein écran et de trois accès par chapitre. Les interactions restent fonctionnelles sans survol sur écran tactile.

Le carnet visuel de 22 secondes est un montage de **photographies animées de Ganvié et d’une véritable séquence aérienne de Ouidah**, sans son. Il n’est pas présenté comme un reportage tourné par l’agence. Sources sous licence Pexels : Kenza Loussouarn (photos 6729748 et 6729842), mataki klimtetou (vidéo 17511220, extrait de dix secondes de la source de 12,33 secondes). Les auteurs, modifications et liens originaux sont indiqués sur /credits. Les photos sous CC BY-SA de la première refonte ne sont pas incorporées dans ce montage.

Fichiers locaux H.264 avec métadonnées faststart : `public/videos/benin-carnet-ambient.mp4` (1280 × 720, 24 images/s, environ 1,8 Mo) et `benin-carnet-hd.mp4` (1920 × 1080, environ 6,9 Mo). L’affiche est dans `public/images/benin-film-poster.jpg`. Le fichier WebVTT décrit les scènes en français. L’encodage a été effectué hors ligne avec FFmpeg ; aucun encodeur ni nouvelle bibliothèque d’animation n’est requis à l’exécution.

L’ambiance ne reçoit une source vidéo que lorsque la section est visible, l’onglet actif et le lecteur modal fermé. Elle ne démarre pas automatiquement sur les petits écrans, en économie de données, en connexion 2G ou avec `prefers-reduced-motion`. Le visiteur peut cependant demander explicitement la lecture. La version HD n’est chargée qu’après ouverture volontaire du lecteur. Les échecs d’autoplay conservent la photographie, sans message trompeur ni écran vide. Le ruban peut être mis en pause ; il s’arrête hors écran. Le mouvement réduit neutralise les effets non essentiels et rend les textes visibles immédiatement.

Les nouvelles animations sont regroupées dans `src/app/cinematic.css` ; la logique média est isolée dans `ambient-video.tsx`, `cinema-provider.tsx` et `film-section.tsx`. Les composants réutilisables se trouvent dans `motion-primitives.tsx`. Les tests supplémentaires du lecteur, des chapitres, des préférences de mouvement et des fichiers vidéo sont dans `tests/cinema.spec.ts`. Les fonctions de devis et la base indépendante restent inchangées.
