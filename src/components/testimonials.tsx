"use client";

import Image from "next/image";
import Link from "next/link";
import { Quote, ArrowUpRight, Mail, Star } from "lucide-react";
import { site } from "@/lib/content";
import { Reveal } from "./reveal";

const testimonials = [
  {
    name: "Karim D.",
    city: "Cotonou, Bénin",
    rating: 5,
    text: "Une organisation parfaite pour découvrir le Bénin authentique. L'équipe d'AYIFFA nous a fait vivre des moments inoubliables à Ganvié et Ouidah.",
    avatar: "/images/avatar-1.jpg",
  },
  {
    name: "Sophie L.",
    city: "Paris, France",
    rating: 5,
    text: "Un voyage sur mesure exceptionnel. Grand-Popo, les cocotiers, l'océan — tout était réuni pour ralentir et se ressourcer.",
    avatar: "/images/avatar-2.jpg",
  },
  {
    name: "Jean-Baptiste K.",
    city: "Porto-Novo, Bénin",
    rating: 5,
    text: "Professionnalisme et chaleur humaine. Un guide passionné qui connaît chaque recoin de son pays. Je recommande les yeux fermés.",
    avatar: "/images/avatar-3.jpg",
  },
];

export function Testimonials() {
  return (
    <section className="section container home-testimonials" id="temoignages">
      <div className="container">
        <div className="testimonial-heading">
          <Reveal variant="rise" delay={100} className="animate-fade-up">
            <p className="eyebrow"><span/>PAROLES DE VOYAGEURS</p>
          </Reveal>
          <Reveal variant="rise" delay={200} className="animate-fade-up">
            <h2>Les plus beaux voyages<br/><em>se racontent aussi.</em></h2>
          </Reveal>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t, index) => (
            <Reveal key={t.name} variant="rise" delay={300 + index * 150} className={`animate-slide-up stagger-${index + 1}`}>
              <article className="testimonial-card card-lift">
                <div className="testimonial-avatar">
                  <Image src={t.avatar} alt={t.name} width={56} height={56} className="rounded-full" priority={index === 0}/>
                </div>
                <div className="testimonial-content">
                  <div className="testimonial-stars">
                    <span className="sr-only">{t.rating} sur 5 étoiles</span>
                    {[...Array(t.rating)].map(() => (
                      <Star size={14} strokeWidth={1.5} className="text-cta fill-current" aria-hidden="true"/>
                    ))}
                  </div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-author">
                    <strong>{t.name}</strong>
                    <span className="testimonial-city">{t.city}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="testimonial-empty">
          <Quote size={34} strokeWidth={1.1} className="testimonial-quote-icon"/>
          <h3>Et si le prochain récit<br/>était le vôtre ?</h3>
          <p>Vous avez découvert le Bénin avec AYIFFA TOURISME ? Partagez les moments qui vous ont marqué. Les témoignages vérifiés seront publiés ici, après accord de leurs auteurs.</p>
          <Link href={`mailto:${site.email}?subject=Mon%20exp%C3%A9rience%20avec%20AYIFFA%20TOURISME`} className="button button-terra">
            <Mail size={17}/>Raconter mon voyage<ArrowUpRight size={17}/>
          </Link>
          <small>Aucun avis fictif : nous préférons la sincérité à la mise en scène.</small>
        </div>
      </div>
    </section>
  );
}