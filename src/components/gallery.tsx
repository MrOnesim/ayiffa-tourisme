"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

const curated = [
  {src:"/images/ouidah.jpg",alt:"Cases traditionnelles et paysage de Ouidah vus du ciel",place:"Ouidah · Un autre point de vue",credit:"Adedoyin ADEROMOLA / Pexels"},
  {src:"/images/ganvie.jpg",alt:"Une pirogue à la voile colorée sur le lac Nokoué",place:"Ganvié · Au rythme du lac",credit:"Kenza Loussouarn / Pexels"},
  {src:"/images/culture.jpg",alt:"Cérémonie traditionnelle à Abomey-Calavi",place:"Abomey-Calavi · Une culture vivante",credit:"Abdias GBETOKPANOU / Pexels"},
  {src:"/images/pirogue.jpg",alt:"Une femme en pirogue dans les herbes du lac Nokoué",place:"Lac Nokoué · Entre ciel et eau",credit:"Kenza Loussouarn / Pexels"},
  {src:"/images/grand-popo-palms.jpg",alt:"Cocotiers et hamacs sur le littoral de Grand-Popo",place:"Grand-Popo · Le temps suspendu",credit:"Heikki Kastemaa / Wikimedia Commons · CC BY-SA 4.0"},
  {src:"/images/benin-road.jpg",alt:"La route au cœur de la végétation à Dassa",place:"Dassa · Prendre la route",credit:"Anthony Desrochers / Pexels"},
  {src:"/images/lagoon.jpg",alt:"Traversée de la lagune de Grand-Popo",place:"Grand-Popo · La lagune",credit:"Heikki Kastemaa / Wikimedia Commons · CC BY-SA 4.0"},
  {src:"/images/grand-popo.jpg",alt:"Le littoral de Grand-Popo, entre plage et cocotiers",place:"Grand-Popo · L'océan",credit:"Fawaz.tairou / Wikimedia Commons · CC BY-SA 4.0"},
];

const recovered = [1,2,3,10,11,12,14,15,16,17,18,19,20,21,22,23,24].map(n => {
  const nn = String(n).padStart(2, "0");
  return { src: `/images/gallery-${nn}.jpg`, alt: "Instant du Bénin", place: `Bénin · Regard ${n}`, credit: "AYIFFA TOURISME / site historique" };
});

export const galleryPhotos = [...curated, ...recovered];

export function Gallery({full=false}:{full?:boolean}) {
  const [active,setActive]=useState(0);
  const dialog=useRef<HTMLDialogElement>(null);
  const photos=full?galleryPhotos:galleryPhotos.slice(0,4);
  function open(index:number){setActive(index);dialog.current?.showModal();}
  function close(){dialog.current?.close();}
  function navigate(direction:number){setActive(current=>(current+direction+photos.length)%photos.length);}
  return <>
    <div className={`gallery-grid ${full?"gallery-full":""}`}>
      {photos.map((photo,index)=>      <button key={photo.src} className={`gallery-tile card-lift shimmer-container`} onClick={()=>open(index)} aria-label={`Agrandir : ${photo.alt}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 600px) 85vw, (max-width: 900px) 45vw, 28vw"/>
        <span className="shimmer-overlay" aria-hidden="true"/>
        <span className="gallery-expand"><Expand size={19}/></span><span className="gallery-label">{photo.place}</span>
      </button>)}
    </div>
    <dialog ref={dialog} className="lightbox" aria-label="Galerie photographique du Bénin" onClick={event=>{if(event.target===event.currentTarget)close();}} onKeyDown={event=>{if(event.key==="ArrowRight")navigate(1);if(event.key==="ArrowLeft")navigate(-1);}}>
      <button className="lightbox-close icon-button" onClick={close} aria-label="Fermer la photographie"><X size={26}/></button>
      <div className="lightbox-layout">
        <button className="lightbox-arrow icon-button" onClick={()=>navigate(-1)} aria-label="Photo précédente"><ArrowLeft/></button>
        <div className="lightbox-figure">
          <div className="lightbox-image"><Image src={photos[active].src} alt={photos[active].alt} fill sizes="90vw" style={{objectFit:"contain"}}/></div>
          <div className="lightbox-caption"><div><h2>{photos[active].place}</h2><p>{photos[active].credit}</p></div><span>{active+1} / {photos.length}</span></div>
        </div>
        <button className="lightbox-arrow icon-button" onClick={()=>navigate(1)} aria-label="Photo suivante"><ArrowRight/></button>
      </div>
    </dialog>
  </>;
}