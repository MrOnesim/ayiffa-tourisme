"use client";
import { useState, useMemo } from "react";
import { Search, Compass, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useContent } from "@/lib/use-content";
import { useLocale } from "./locale-provider";
import { DestinationCard, CircuitCard } from "./ui";

const normalize = (value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();

export function DestinationCatalogue({initialDestination="",initialCategory="",travellers="",startDate=""}:{initialDestination?:string;initialCategory?:string;travellers?:string;startDate?:string}) {
  const { destinations } = useContent();
  const { locale, t } = useLocale();
  const ui = t.ui;
  const labels = t.pages.destinations;
  const categories = useMemo(() => ["", ...Array.from(new Set(destinations.map(d => d.category)))], [destinations]);
  const initial=destinations.find(d=>d.slug===initialDestination||normalize(d.name)===normalize(initialDestination));
  const [query,setQuery]=useState(initial?.name||initialDestination);
  const [category,setCategory]=useState(categories.includes(initialCategory)?initialCategory:categories[0]);
  const filtered=useMemo(()=>destinations.filter(d=>(!category||d.category===category)&&normalize(`${d.name} ${d.region} ${d.intro}`).includes(normalize(query))),[query,category,destinations]);
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
  const dateLocale = { fr: "fr-FR", en: "en-GB", es: "es-ES", de: "de-DE" }[locale];
  return <div className="catalogue container">
    <div className="filter-bar">
      <label className="search-input"><Search size={17} strokeWidth={1.5}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={labels.searchPlaceholder} aria-label={ui.searchDestination}/></label>
      <div className="filter-chips" aria-label={ui.filterByWish}>{categories.map(c=><button key={c} className={`filter-chip ${category===c?"active":""}`} onClick={()=>setCategory(c)} aria-pressed={category===c}>{c||labels.allCategories}</button>)}</div>
    </div>
    <div className="results-bar"><span role="status" aria-live="polite">{filtered.length} {filtered.length!==1?ui.destinationUnits:ui.destinationUnit}</span>{(query||category!==categories[0])&&<button onClick={reset}>{labels.reset}</button>}</div>
    {filtered.length?<div className="destination-grid" key={category}>{filtered.map((destination,index)=><DestinationCard key={destination.slug} destination={destination} index={index} priority={index===0}/>)}</div>:<div className="empty-state"><Compass size={40} strokeWidth={1}/><h2>{labels.emptyTitle}</h2><p>{labels.emptyText}</p><button className="button button-dark" onClick={reset}>{labels.showAll}<ArrowUpRight size={17}/></button></div>}
    {(validTravellers||validStartDate)&&<div className="notice selected-trip"><Compass size={18} aria-hidden="true"/><div>{validTravellers&&<>{ui.tripNotice} {Number(travellers)} {Number(travellers)>1?ui.travellers:ui.traveller}</>}{validTravellers&&validStartDate&&" · "}{validStartDate&&<>{ui.fromDate} {new Date(`${startDate}T12:00:00`).toLocaleDateString(dateLocale)}</>} ? <Link className="text-link" href={contactHref}>{ui.personalize}<ArrowUpRight size={14} aria-hidden="true"/></Link></div></div>}
    <p className="catalogue-note">{ui.destinationsNote}</p>
  </div>;
}

export function CircuitCatalogue() {
  const { circuits } = useContent();
  const { t } = useLocale();
  const ui = t.ui;
  const labels = t.pages.circuits;
  const categories = useMemo(() => ["", ...Array.from(new Set(circuits.map(c => c.category)))], [circuits]);
  const [category,setCategory]=useState(categories[0]);
  const [sort,setSort]=useState("selection");
  const [query,setQuery]=useState("");
  const filtered=useMemo(()=>{
    const result=circuits.filter(c=>(!category||c.category===category)&&normalize(`${c.name} ${c.location} ${c.description}`).includes(normalize(query)));
    if(sort==="short")result.sort((a,b)=>a.days-b.days);
    if(sort==="long")result.sort((a,b)=>b.days-a.days);
    return result;
  },[category,sort,query,circuits]);
  function reset(){setCategory(categories[0]);setQuery("");setSort("selection");}
  return <div className="catalogue container">
    <div className="filter-bar"><label className="search-input"><Search size={17}/><input aria-label={ui.searchCircuit} value={query} onChange={e=>setQuery(e.target.value)} placeholder={labels.searchPlaceholder}/></label><div className="filter-chips" aria-label={ui.circuitTypes}>{categories.map(c=><button key={c} className={`filter-chip ${category===c?"active":""}`} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c||labels.allCategories}</button>)}</div></div>
    <div className="results-bar"><span role="status" aria-live="polite">{filtered.length} {filtered.length!==1?ui.circuitUnits:ui.circuitUnit}</span><label>{ui.sortBy}<select value={sort} onChange={e=>setSort(e.target.value)}><option value="selection">{ui.sortSelection}</option><option value="short">{ui.sortShort}</option><option value="long">{ui.sortLong}</option></select></label></div>
    {filtered.length?<div className="circuit-grid" key={`${category}-${sort}`}>{filtered.map((c,index)=><CircuitCard key={c.slug} circuit={c} priority={index===0}/>)}</div>:<div className="empty-state"><Compass size={40}/><h2>{labels.emptyTitle}</h2><p>{labels.emptyText}</p><button className="button button-dark" onClick={reset}>{labels.reset}<ArrowUpRight size={17}/></button></div>}
    <p className="catalogue-note">{ui.circuitsNote}</p>
  </div>;
}
