import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { appliedIdentity } from "@/lib/applied-identity";

export function AppliedIdentityStatus() {
  return <section className="studio-applied-status" aria-label="Direction artistique appliquée">
    <span className="studio-applied-icon"><CheckCircle2 size={23} strokeWidth={1.4}/></span>
    <div><span className="studio-kicker">DIRECTION APPLIQUÉE À CETTE VERSION</span><h2>{appliedIdentity.name}.</h2><p>{appliedIdentity.summary}</p></div>
    <Link href="/">Voir le site appliqué<ArrowUpRight size={17}/></Link>
  </section>;
}
