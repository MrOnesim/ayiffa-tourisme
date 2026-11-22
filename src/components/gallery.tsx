"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { useLocale } from "./locale-provider";

const curatedSources = [
  "/images/ville ouidah vu du ciel.jpeg",
  "/images/ganvie vu du ciel.jpeg",
  "/images/deux voi vu du ciel.jpeg",
  "/images/GANVIE.jpeg",
  "/images/Grand popo.jpeg",
  "/images/plage ouidah.jpeg",
  "/images/ville ganvie (1).jpeg",
  "/images/ouidah vu du ciel 1.jpeg",
];

const recovered = [1,2,3,10,11,12,14,15,16,17,18,19,20,21,22,23,24].map(n => ({ n, src: `/images/gallery-${String(n).padStart(2, "0")}.jpg` }));

export function Gallery({full=false}:{full?:boolean}) {
  const { t } = useLocale();
  const ui = t.ui;
  const curated = curatedSources.map((src, index) => ({
    src,
    alt: ui[`galleryAlt${index + 1}` as keyof typeof ui] as string,
    place: ui[`galleryPlace${index + 1}` as keyof typeof ui] as string,
    credit: ui.galleryCreditCurated,
  }));
  const recoveredPhotos = recovered.map(item => ({
    src: item.src,
    alt: ui.galleryRecoveredAlt,
    place: `${ui.galleryRecoveredPlace} ${item.n}`,
    credit: ui.galleryCreditRecovered,
  }));
  const allPhotos = [...curated, ...recoveredPhotos];
  const [active,setActive]=useState(0);
  const dialog=useRef<HTMLDialogElement>(null);
  const photos=full?allPhotos:allPhotos.slice(0,4);
  function open(index:number){setActive(index);dialog.current?.showModal();}
  function close(){dialog.current?.close();}
  function navigate(direction:number){setActive(current=>(current+direction+photos.length)%photos.length);}
  return <>
    <div className={`gallery-grid ${full?"gallery-full":""}`}>
      {photos.map((photo,index)=>      <button key={photo.src} className={`gallery-tile card-lift shimmer-container`} onClick={()=>open(index)} aria-label={`${ui.galleryEnlarge} ${photo.alt}`}>
        <Image src={photo.src} alt={photo.alt} fill priority={index===0} sizes="(max-width: 600px) 85vw, (max-width: 900px) 45vw, 28vw"/>
        <span className="shimmer-overlay" aria-hidden="true"/>
        <span className="gallery-expand"><Expand size={19}/></span><span className="gallery-label">{photo.place}</span>
      </button>)}
    </div>
    <dialog ref={dialog} className="lightbox" aria-label={ui.galleryAria} onClick={event=>{if(event.target===event.currentTarget)close();}} onKeyDown={event=>{if(event.key==="ArrowRight")navigate(1);if(event.key==="ArrowLeft")navigate(-1);}}>
      <button className="lightbox-close icon-button" onClick={close} aria-label={ui.galleryClose}><X size={26}/></button>
      <div className="lightbox-layout">
        <button className="lightbox-arrow icon-button" onClick={()=>navigate(-1)} aria-label={ui.galleryPrev}><ArrowLeft/></button>
        <div className="lightbox-figure">
          <div className="lightbox-image" style={{position:"relative"}}><Image src={photos[active].src} alt={photos[active].alt} fill sizes="90vw" style={{objectFit:"contain"}}/></div>
          <div className="lightbox-caption"><div><h2>{photos[active].place}</h2><p>{photos[active].credit}</p></div><span>{active+1} / {photos.length}</span></div>
        </div>
        <button className="lightbox-arrow icon-button" onClick={()=>navigate(1)} aria-label={ui.galleryNext}><ArrowRight/></button>
      </div>
    </dialog>
  </>;
}
