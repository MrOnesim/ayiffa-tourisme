"use client";
import { useState, useMemo } from "react";
import { Search, Compass, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useContent } from "@/lib/use-content";
import { DestinationCard, CircuitCard } from "./ui";

const normalize = (value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
export function DestinationCatalogue({initialDestination="",initialCategory="",travellers="",startDate=""}:{initialDestination?:string;initialCategory?:string;travellers?:string;startDate?:string}) {
  const { destinations } = useContent();
  const initial=destinations.find(d=>d.slug===initialDestination||normalize(d.name)===normalize(initialDestination));
  const [query,setQuery]=useState(initial?.name||initialDestination);
  const categories=["Toutes les envies","Culture & patrimoine","Au fil de l’eau","Évasion & nature"];
  const [category,setCategory]=useState(categories.includes(initialCategory)?initialCategory:categories[0]);
  const filtered=useMemo(()=>destinations.filter(d=>(category==="Toutes les envies"||d.category===category)&&normalize(`${d.name} ${d.region} ${d.intro}`).includes(normalize(query))),[query,category,destinations]);
  const selectedDestination=destinations.find(d=>d.slug===query||normalize(d.name)===normalize(query));
  const validTravellers = /^\d+$/.test(travellers) && Number(travellers) >= 1 && Number(travellers) <= 30;
  const parsedStartDate = new Date(`${startDate}T12:00:00Z`);
  const validStartDate = /^\d{4}-\d{2}-\d{2}$/.test(startDate) && !Number.isNaN(parsedStartDate.getTime()) && parsedStartDate.toISOString().slice(0, 10) === startDate;
  const contactParams = new URLSearchParams();
  if (selectedDestination) contactParams.set("destination", selectedDestination.slug);
  if (validTravellers) contactParams.set("voyageurs", travellers);
  if (validStartDate) contactParams.set("startDate", startDate);
  const contactQuery = contactParams.toString();
  const contactHref = contactQuery ? `/contact?${contactQuery}` : "/contact";
  function reset(){setQuery("");setCategory(categories[0]);}
  return <div className="catalogue container"><div className="filter-bar"><label className="search-input"><Search size={17} strokeWidth={1.5}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Un lieu, une envie, une découverte…" aria-label="Rechercher une destination"/></label><div className="filter-chips" aria-label="Filtrer par envie">{categories.map(c=><button key={c} className={`filter-chip ${category===c?"active":""}`} onClick={()=>setCategory(c)} aria-pressed={category===c}>{c}</button>)}</div></div><div className="results-bar"><span role="status" aria-live="polite">{filtered.length} destination{filtered.length!==1?"s":""} à découvrir</span>{(query||category!==categories[0])&&<button onClick={reset}>Réinitialiser les filtres</button>}</div>{filtered.length?<div className="destination-grid" key={category}>{filtered.map((destination,index)=><DestinationCard key={destination.slug} destination={destination} index={index}/>)}</div>:<div className="empty-state"><Compass size={40} strokeWidth={1}/><h2>Un autre chemin vous attend.</h2><p>Aucune destination ne correspond à ces critères. Essayez une autre envie ou explorez toutes nos destinations.</p><button className="button button-dark" onClick={reset}>Voir toutes les destinations<ArrowUpRight size={17}/></button></div>}{(validTravellers||validStartDate)&&<div className="notice selected-trip"><Compass size={18} aria-hidden="true"/><div>{validTravellers&&<>Vous préparez un séjour pour {Number(travellers)} voyageur{Number(travellers)>1?"s":""}</>}{validTravellers&&validStartDate&&" · "}{validStartDate&&<>à partir du {new Date(`${startDate}T12:00:00`).toLocaleDateString("fr-FR")}</>} ? <Link className="text-link" href={contactHref}>Personnalisons votre voyage<ArrowUpRight size={14} aria-hidden="true"/></Link></div></div>}<p className="catalogue-note">Les lieux présentés figurent dans les contenus publics d’AYIFFA TOURISME. L’accès aux sites, les disponibilités et le programme sont confirmés avec l’agence avant tout départ. Les photographies d’ambiance sont identifiées sur les pages concernées.</p></div>;
}

export function CircuitCatalogue() {
  const { circuits } = useContent();
  const [category,setCategory]=useState("Tous les voyages");
  const [sort,setSort]=useState("selection");
  const [query,setQuery]=useState("");
  const categories=["Tous les voyages","Culture & patrimoine","Nature & rencontres","Voyage sur mesure"];
  const filtered=useMemo(()=>{
    const result=circuits.filter(c=>(category==="Tous les voyages"||c.category===category)&&normalize(`${c.name} ${c.location} ${c.description}`).includes(normalize(query)));
    if(sort==="short")result.sort((a,b)=>a.days-b.days);
    if(sort==="long")result.sort((a,b)=>b.days-a.days);
    return result;
  },[category,sort,query,circuits]);
  function reset(){setCategory(categories[0]);setQuery("");setSort("selection");}
  return <div className="catalogue container"><div className="filter-bar"><label className="search-input"><Search size={17}/><input aria-label="Rechercher un circuit" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Le voyage qui vous ressemble…"/></label><div className="filter-chips" aria-label="Types de voyages">{categories.map(c=><button key={c} className={`filter-chip ${category===c?"active":""}`} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div></div><div className="results-bar"><span role="status" aria-live="polite">{filtered.length} idée{filtered.length!==1?"s":""} de voyage</span><label>Trier par<select value={sort} onChange={e=>setSort(e.target.value)}><option value="selection">Notre sélection</option><option value="short">Durée croissante</option><option value="long">Durée décroissante</option></select></label></div>{filtered.length?<div className="circuit-grid" key={`${category}-${sort}`}>{filtered.map(c=><CircuitCard key={c.slug} circuit={c}/>)}</div>:<div className="empty-state"><Compass size={40}/><h2>Élargissons les horizons.</h2><p>Aucun circuit ne correspond à votre recherche.</p><button className="button button-dark" onClick={reset}>Réinitialiser la recherche<ArrowUpRight size={17}/></button></div>}<p className="catalogue-note">Aucun prix n’est affiché sans confirmation. Chaque voyage fait l’objet d’un devis précisant son programme, ses inclusions, ses disponibilités et ses conditions de réservation.</p></div>;
}
