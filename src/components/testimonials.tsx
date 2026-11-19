"use client";

import Link from "next/link";
import { Quote, ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/lib/content";
import { Reveal } from "./reveal";

export function Testimonials() {
  return (
    <section className="section home-testimonials" id="temoignages">
      <div className="container">
        <div className="testimonial-heading">
          <Reveal variant="rise" delay={100}>
            <p className="eyebrow">TRANSPARENCE AVANT TOUT</p>
          </Reveal>
          <Reveal variant="rise" delay={200}>
            <h2>Les expériences de nos voyageurs<br/><em>seront racontées ici.</em></h2>
          </Reveal>
        </div>
        <Reveal variant="rise">
          <div className="testimonial-empty">
          <Quote size={34} strokeWidth={1.1} className="testimonial-quote-icon"/>
          <h3>Aucun témoignage vérifié n’est publié pour le moment.</h3>
          <p>Nous publierons ici les retours de voyageurs après vérification de leur expérience et avec leur accord.</p>
          <Link href={`mailto:${site.email}?subject=Mon%20exp%C3%A9rience%20avec%20AYIFFA%20TOURISME`} className="button button-terra">
            <Mail size={17}/>Raconter mon voyage<ArrowUpRight size={17}/>
          </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}