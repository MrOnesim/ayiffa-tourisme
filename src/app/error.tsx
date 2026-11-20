"use client";
import Link from "next/link";
import { Compass, RotateCcw, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { EmLines } from "@/components/lines";

export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){
  const ui = useLocale().t.ui;
  return <section className="not-found container"><Compass size={60} strokeWidth={1}/><p className="eyebrow">{ui.errorEyebrow}</p><h1><EmLines text={`${ui.errorTitleLead}\n${ui.errorTitleEm}`}/></h1><p>{ui.errorText}</p><button className="button button-dark" onClick={reset}>{ui.errorRetry}<RotateCcw size={17}/></button><Link href="/" className="button button-light">{ui.errorHome}<ArrowUpRight size={17}/></Link></section>;
}
