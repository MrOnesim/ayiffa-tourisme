"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

const curated = [
  {src:"/images/ville ouidah vu du ciel.jpeg",alt:"Vue aérienne de la ville de Ouidah",place:"Ouidah · Un autre point de vue",credit:"AYIFFA TOURISME · photographie locale"},
  {src:"/images/ganvie vu du ciel.jpeg",alt:"Vue aérienne de Ganvié et du lac Nokoué",place:"Ganvié · Au rythme du lac",credit:"AYIFFA TOURISME · photographie locale"},
  {src:"/images/deux voi vu du ciel.jpeg",alt:"Vue aérienne du littoral de Grand-Popo",place:"Grand-Popo · Entre terre et océan",credit:"AYIFFA TOURISME · photographie locale"},
  {src:"/images/GANVIE.jpeg",alt:"Maisons sur pilotis et pirogues à Ganvié",place:"Ganvié · La vie sur l’eau",credit:"AYIFFA TOURISME · photographie locale"},
  {src:"/images/Grand popo.jpeg",alt:"La plage de Grand-Popo vue du ciel",place:"Grand-Popo · Le temps suspendu",credit:"AYIFFA TOURISME · photographie locale"},
  {src:"/images/plage ouidah.jpeg",alt:"Cocotiers et parasols sur la côte de Ouidah",place:"Ouidah · Sur le littoral",credit:"AYIFFA TOURISME · photographie locale"},
  {src:"/images/ville ganvie (1).jpeg",alt:"Vue du village lacustre de Ganvié",place:"Ganvié · Les maisons sur pilotis",credit:"AYIFFA TOURISME · photographie locale"},
  {src:"/images/ouidah vu du ciel 1.jpeg",alt:"Vue aérienne de la route et du littoral de Ouidah",place:"Ouidah · L’horizon Atlantique",credit:"AYIFFA TOURISME · photographie locale"},
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