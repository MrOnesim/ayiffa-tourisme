import Link from "next/link";
import { ArrowUpRight, ChevronDown, Compass, MapPin, Users } from "lucide-react";
import { useContent } from "@/lib/use-content";

const interests = ["Culture & patrimoine", "Au fil de l’eau", "Évasion & nature"];

export function TripDiscovery() {
  const { destinations } = useContent();
  return <section className="container discovery-container signature-discovery" aria-labelledby="discovery-title">
    <div className="discovery-heading"><div><Compass size={18} strokeWidth={1.4}/><h2 id="discovery-title">Votre voyage commence par une envie.</h2></div><Link href="/contact">À définir ensemble<ArrowUpRight size={15}/></Link></div>
    <form action="/destinations" className="discovery-bar" aria-label="Trouver une destination">
      <label className="discovery-field"><MapPin size={21} strokeWidth={1.4}/><span><span className="field-caption">VOTRE PROCHAINE ESCALE</span><span className="select-wrapper"><select name="destination" defaultValue=""><option value="">Où souhaitez-vous aller ?</option>{destinations.map(destination => <option value={destination.slug} key={destination.slug}>{destination.name}</option>)}</select><ChevronDown size={15}/></span></span></label>
      <label className="discovery-field"><Compass size={22} strokeWidth={1.4}/><span><span className="field-caption">VOTRE FAÇON DE VOYAGER</span><span className="select-wrapper"><select name="envie" defaultValue=""><option value="">Qu’est-ce qui vous inspire ?</option>{interests.map(interest => <option key={interest}>{interest}</option>)}</select><ChevronDown size={15}/></span></span></label>
      <label className="discovery-field discovery-travellers"><Users size={22} strokeWidth={1.4}/><span><span className="field-caption">BIEN ACCOMPAGNÉ</span><span className="select-wrapper"><select name="voyageurs" defaultValue="2">{[1,2,3,4,5,6,7,8].map(number => <option key={number} value={number}>{number} voyageur{number > 1 ? "s" : ""}</option>)}<option value="9">Un petit groupe</option></select><ChevronDown size={15}/></span></span></label>
      <button type="submit" className="button button-terra">Trouver mon évasion<ArrowUpRight size={19}/></button>
    </form>
    <div className="discovery-shortcuts"><span>Ou laissez-vous guider</span>{interests.map(interest => <Link key={interest} href={`/destinations?envie=${encodeURIComponent(interest)}`}>{interest}<ArrowUpRight size={12}/></Link>)}</div>
  </section>;
}
