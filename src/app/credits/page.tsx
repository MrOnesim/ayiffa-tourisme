import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/ui";
import { beninFilm } from "@/lib/film";

export const metadata: Metadata = { title: "Crédits des photographies & du film", description: "Photographes, vidéaste, sources et licences des images et du carnet visuel utilisés par AYIFFA TOURISME.", alternates: { canonical: "/credits" } };

const photos = [
  { src: "/images/grand-popo.jpg", name: "La plage de Grand-Popo", author: "Fawaz.tairou", source: "https://commons.wikimedia.org/wiki/File:Plage_%C3%A0_l%27Auberge_de_Grand-Popo_au_sud_du_B%C3%A9nin_06.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { src: "/images/ganvie.jpg", name: "Sur le lac Nokoué, à Ganvié", author: "Kenza Loussouarn", source: "https://www.pexels.com/photo/6729748/", license: "Licence Pexels", licenseUrl: "https://www.pexels.com/license/" },
  { src: "/images/ouidah.jpg", name: "Ouidah vue du ciel", author: "Adedoyin ADEROMOLA", source: "https://www.pexels.com/photo/32032141/", license: "Licence Pexels", licenseUrl: "https://www.pexels.com/license/" },
  { src: "/images/culture.jpg", name: "Traditions à Abomey-Calavi", author: "Abdias GBETOKPANOU", source: "https://www.pexels.com/photo/25945408/", license: "Licence Pexels", licenseUrl: "https://www.pexels.com/license/" },
  { src: "/images/pirogue.jpg", name: "Une pirogue à Ganvié", author: "Kenza Loussouarn", source: "https://www.pexels.com/photo/6729842/", license: "Licence Pexels", licenseUrl: "https://www.pexels.com/license/" },
  { src: "/images/benin-road.jpg", name: "La route à Dassa", author: "Anthony Desrochers", source: "https://www.pexels.com/photo/14868341/", license: "Licence Pexels", licenseUrl: "https://www.pexels.com/license/" },
  { src: "/images/lagoon.jpg", name: "Traversée de la lagune de Grand-Popo", author: "Heikki Kastemaa (Kulttuurinavigaattori)", source: "https://commons.wikimedia.org/wiki/File:Across_the_lagoon.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { src: "/images/grand-popo-palms.jpg", name: "Hamacs et cocotiers à Grand-Popo", author: "Heikki Kastemaa (Kulttuurinavigaattori)", source: "https://commons.wikimedia.org/wiki/File:Hammocks_and_palm_trees.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
];

export default function CreditsPage() {
  return <>
    <PageIntro label="CRÉDITS & SOURCES" title={<>Des regards singuliers.<br/><em>Des auteurs reconnus.</em></>} description="Derrière chaque image, il y a un regard. Retrouvez les auteurs, les sources et les licences des photographies et de notre carnet visuel."/>
    <div className="container legal-content">
      <section id="le-film-credit"><h2>Le Bénin, intensément : le carnet visuel</h2><p>{beninFilm.description}</p><p>Ce montage éditorial de 22 secondes associe deux photographies animées par des mouvements de cadrage et dix secondes d’une vidéo aérienne de Ouidah. Il est présenté sans son ni dialogue. Il ne s’agit pas d’un reportage tourné par l’agence ou d’un témoignage client.</p><ul>{beninFilm.sources.map(source => <li key={source.url}><strong>{source.author}</strong>, {source.type}. <a href={source.url} target="_blank" rel="noopener noreferrer">Source originale sur Pexels</a>.</li>)}</ul><p>Licence des trois sources : <a href="https://www.pexels.com/license/" target="_blank" rel="noopener noreferrer">licence Pexels</a>. Adaptations : montage, recadrages, mouvements de zoom, fondus, extraction de l’affiche et encodage en H.264. Les fichiers vidéo et leurs descriptions françaises sont hébergés localement ; aucun lecteur publicitaire ou outil de suivi vidéo tiers n’est intégré.</p></section>
      <h2>Le carnet photographique</h2>
      <p>Toutes les photographies affichées ci-dessous ont été réalisées au Bénin. Certaines sont utilisées comme photographies d’ambiance sur des destinations voisines ; cette utilisation est signalée sur les pages concernées. Elles ne représentent pas nécessairement les prestations ou les clients d’AYIFFA TOURISME.</p>
      {photos.map(photo => <article className="credit-row" key={photo.src}><div className="credit-image"><Image src={photo.src} alt={photo.name} fill sizes="150px"/></div><div><h2>{photo.name}</h2><p>Photographie : {photo.author}</p><p><a href={photo.source} target="_blank" rel="noopener noreferrer">Photographie originale</a> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a></p><p>Adaptations : redimensionnement, compression, recadrage à l’écran et, selon les sections, filtre colorimétrique ou voile de contraste. Les adaptations des images CC BY-SA restent sous licence CC BY-SA 4.0.</p></div></article>)}
      <h2>Typographies et icônes</h2><p>Cormorant Garamond et DM Sans, distribuées sous licence SIL Open Font License, sont hébergées localement. Les textes des licences sont disponibles pour <a href="/fonts/OFL-Cormorant.txt">Cormorant Garamond</a> et <a href="/fonts/OFL-DMSans.txt">DM Sans</a>. Les icônes Lucide sont distribuées sous licence ISC. La signature graphique AYIFFA de cette refonte est une proposition de création à faire valider par l’agence.</p>
      <h2>Sources éditoriales</h2><p>Les destinations, les coordonnées et les services ont été rapprochés des contenus publics indexés de <a href="https://ayiffatourisme.com/" target="_blank" rel="noopener noreferrer">ayiffatourisme.com</a>, de sa page « À propos », de sa page de demande de devis et de ses pages de découvertes locales. Le serveur historique n’étant pas directement accessible lors de l’audit, les informations commerciales restent à revalider avant publication.</p><p>Les textes éditoriaux de la refonte sont des propositions de présentation. Les prix, avis clients, dates de fondation, certifications et statistiques non vérifiés ont volontairement été omis.</p>
    </div>
  </>;
}
