import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/ui";
import { EmLines, RichText } from "@/components/lines";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getLocalizedFilm } from "@/lib/localized-data";
import { getPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(await getServerLocale(), "credits", "/credits");
}

const photos = [
  { src: "/images/grand-popo.jpg", source: "https://commons.wikimedia.org/wiki/File:Plage_%C3%A0_l%27Auberge_de_Grand-Popo_au_sud_du_B%C3%A9nin_06.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { src: "/images/ganvie.jpg", source: "https://www.pexels.com/photo/6729748/", license: "pexels", licenseUrl: "https://www.pexels.com/license/" },
  { src: "/images/ouidah.jpg", source: "https://www.pexels.com/photo/32032141/", license: "pexels", licenseUrl: "https://www.pexels.com/license/" },
  { src: "/images/culture.jpg", source: "https://www.pexels.com/photo/25945408/", license: "pexels", licenseUrl: "https://www.pexels.com/license/" },
  { src: "/images/pirogue.jpg", source: "https://www.pexels.com/photo/6729842/", license: "pexels", licenseUrl: "https://www.pexels.com/license/" },
  { src: "/images/benin-road.jpg", source: "https://www.pexels.com/photo/14868341/", license: "pexels", licenseUrl: "https://www.pexels.com/license/" },
  { src: "/images/lagoon.jpg", source: "https://commons.wikimedia.org/wiki/File:Across_the_lagoon.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { src: "/images/grand-popo-palms.jpg", source: "https://commons.wikimedia.org/wiki/File:Hammocks_and_palm_trees.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
];

export default async function CreditsPage() {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const t = dict.legal.credits;
  const film = getLocalizedFilm(locale);
  return <>
    <PageIntro label={t.label} title={<EmLines text={`${t.titleLead}\n${t.titleEm}`}/>} description={t.description}/>
    <div className="container legal-content">
      <section id="le-film-credit">
        <h2>{t.filmHeading}</h2>
        <p>{film.description}</p>
        <p>{t.filmEdit}</p>
        <ul>{film.sources.map(source => <li key={source.url}><strong>{source.author}</strong>, {source.type}. <a href={source.url} target="_blank" rel="noopener noreferrer">{t.filmSource}</a>.</li>)}</ul>
        <p><RichText html={t.filmLicense}/></p>
      </section>
      <h2>{t.photosHeading}</h2>
      <p>{t.photoNote}</p>
      {photos.map((photo, index) => {
        const name = t.photoNames[index] ?? "";
        return <article className="credit-row" key={photo.src}>
          <div className="credit-image"><Image src={photo.src} alt={name} fill sizes="150px"/></div>
          <div>
            <h2>{name}</h2>
            <p>{t.creditPhotographer} {photo.license === "pexels" ? t.pexelsLicense : "Wikimedia Commons / CC BY-SA"}</p>
            <p><a href={photo.source} target="_blank" rel="noopener noreferrer">{t.originalPhoto}</a> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license === "pexels" ? t.pexelsLicense : photo.license}</a></p>
            <p>{t.photoAdapt}</p>
          </div>
        </article>;
      })}
      <h2>{t.typographyHeading}</h2>
      <p><RichText html={t.typographyText}/></p>
      <h2>{t.sourcesHeading}</h2>
      <p><RichText html={t.sourcesText1}/></p>
      <p><RichText html={t.sourcesText2}/></p>
    </div>
  </>;
}
