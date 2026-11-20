import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { EmLines } from "@/components/lines";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";

export default async function NotFound(){
  const ui = getDictionary(await getServerLocale()).ui;
  return <section className="not-found container"><Compass size={60} strokeWidth={1}/><p className="eyebrow">{ui.notFoundEyebrow}</p><h1><EmLines text={`${ui.notFoundTitleLead}\n${ui.notFoundTitleEm}`}/></h1><p>{ui.notFoundText}</p><ButtonLink href="/destinations">{ui.notFoundCta}</ButtonLink><ButtonLink href="/" variant="light">{ui.notFoundHome}</ButtonLink></section>;
}
