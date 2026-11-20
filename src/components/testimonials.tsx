"use client";

import Link from "next/link";
import { Quote, ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/lib/content";
import { useLocale } from "./locale-provider";
import { EmLines } from "./lines";
import { Reveal } from "./reveal";

export function Testimonials() {
  const { t } = useLocale();
  const ui = t.ui;
  return (
    <section className="section home-testimonials" id="temoignages">
      <div className="container">
        <div className="testimonial-heading">
          <Reveal variant="rise" delay={100}>
            <p className="eyebrow">{ui.testimonialEyebrow}</p>
          </Reveal>
          <Reveal variant="rise" delay={200}>
            <h2><EmLines text={ui.testimonialTitleLead + "\n" + ui.testimonialTitleEm}/></h2>
          </Reveal>
        </div>
        <Reveal variant="rise">
          <div className="testimonial-empty">
          <Quote size={34} strokeWidth={1.1} className="testimonial-quote-icon"/>
          <h3>{ui.testimonialNone}</h3>
          <p>{ui.testimonialText}</p>
          <Link href={`mailto:${site.email}?subject=Mon%20exp%C3%A9rience%20avec%20AYIFFA%20TOURISME`} className="button button-terra">
            <Mail size={17}/>{ui.testimonialButton}<ArrowUpRight size={17}/>
          </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
