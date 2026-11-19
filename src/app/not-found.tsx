import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui";
export default function NotFound(){return <section className="not-found container"><Compass size={60} strokeWidth={1}/><p className="eyebrow">404 · UN PETIT DÉTOUR</p><h1>Ce chemin reste<br/><em>à explorer.</em></h1><p>Cette page n’existe pas, mais de belles découvertes vous attendent.</p><ButtonLink href="/destinations">Explorer les destinations</ButtonLink><ButtonLink href="/" variant="light">Revenir à l’accueil</ButtonLink></section>;}
