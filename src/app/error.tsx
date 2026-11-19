"use client";
import Link from "next/link";
import { Compass, RotateCcw, ArrowUpRight } from "lucide-react";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <section className="not-found container"><Compass size={60} strokeWidth={1}/><p className="eyebrow">UNE COURTE PARENTHÈSE</p><h1>Le voyage marque<br/><em>une petite pause.</em></h1><p>Cette page rencontre une difficulté temporaire. Réessayons ensemble.</p><button className="button button-dark" onClick={reset}>Réessayer<RotateCcw size={17}/></button><Link href="/" className="button button-light">Revenir à l’accueil<ArrowUpRight size={17}/></Link></section>;}
