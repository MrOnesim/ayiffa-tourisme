"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Info, LoaderCircle, LockKeyhole, Mail, MessageCircle, Send } from "lucide-react";
import { site } from "@/lib/content";
import { useContent } from "@/lib/use-content";
import { useLocale } from "./locale-provider";
import { validateTravelRequest, type FormErrors, type TravelRequestPayload } from "@/lib/validation";

export function TravelForm({ initialDestination = "", initialCircuit = "", initialTravellers = 2, initialStartDate = "", initialStops = [] }: { initialDestination?: string; initialCircuit?: string; initialTravellers?: number; initialStartDate?: string; initialStops?: string[] }) {
  const { destinations, circuits } = useContent();
  const { locale, t } = useLocale();
  const ui = t.ui;
  const fieldsLabels = t.contact;
  const dateLocale = { fr: "fr-FR", en: "en-GB", es: "es-ES", de: "de-DE" }[locale];
  const form = useRef<HTMLFormElement>(null);
  const requestKey = useRef<string | null>(null);
  const successPanel = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<{ reference: string; data: TravelRequestPayload } | null>(null);
  const [copied, setCopied] = useState(false);
  const selectedCircuit = circuits.find(circuit => circuit.slug === initialCircuit);
  const stopNames = initialStops.map(slug => destinations.find(item => item.slug === slug)?.name).filter((name): name is string => Boolean(name));
  const prefillMessage = stopNames.length ? `${ui.formStopsMessage} ${stopNames.join(", ")}.` : "";
  const [messageLength, setMessageLength] = useState(prefillMessage.length);
  const destination = destinations.some(item => item.slug === initialDestination) ? initialDestination : "a-definir";

  useEffect(() => { if (success) successPanel.current?.focus(); }, [success]);
  function errorFor(name: keyof TravelRequestPayload) { return errors[name] ? <span id={`${name}-error`} className="field-error">{errors[name]}</span> : null; }
  const validity = (name: keyof TravelRequestPayload) => ({ "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `${name}-error` : undefined });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setGeneralError(""); setErrors({});
    const fields = new FormData(event.currentTarget);
    requestKey.current ??= crypto.randomUUID();
    const payload = { firstName: fields.get("firstName"), lastName: fields.get("lastName"), email: fields.get("email"), phone: fields.get("phone"), destination: fields.get("destination"), startDate: fields.get("startDate"), travellers: Number(fields.get("travellers")), message: fields.get("message"), circuit: selectedCircuit?.slug || "", consent: fields.get("consent") === "on", website: fields.get("website") || "", requestKey: requestKey.current };
    const validation = validateTravelRequest(payload, locale);
    if (!validation.valid) {
      setErrors(validation.errors);
      const first = Object.keys(validation.errors)[0];
      (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/demandes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(validation.data) });
      const result = await response.json();
      if (!response.ok) { setErrors(result.errors || {}); setGeneralError(result.message || ui.apiError); return; }
      if (typeof result.reference !== "string" || result.success !== true) throw new Error("Invalid confirmation");
      setSuccess({ reference: result.reference, data: validation.data });
    } catch { setGeneralError(ui.networkError); }
    finally { setPending(false); }
  }

  function summary() {
    if (!success) return "";
    const { data, reference } = success;
    const place = destinations.find(item => item.slug === data.destination)?.name || ui.toDefine;
    return `${ui.summaryHello}\n\n${ui.summaryIntro} ${reference}).\n\n${ui.summaryName} ${data.firstName} ${data.lastName}\n${ui.summaryEmail} ${data.email}${data.phone ? `\n${ui.summaryPhone} ${data.phone}` : ""}\n${ui.summaryDestination} ${place}${selectedCircuit ? `\n${ui.summaryCircuit} ${selectedCircuit.name}` : ""}\n${ui.summaryTravellers} ${data.travellers}\n${ui.summaryDate} ${data.startDate || ui.toDefine}\n\n${data.message.slice(0,1800)}\n\n${ui.summaryThanks}`;
  }

  if (success) return <div className="form-card signature-form"><div className="form-success" ref={successPanel} tabIndex={-1} role="status"><span className="success-icon"><Check size={28} strokeWidth={1.5}/></span><p className="eyebrow">{ui.successEyebrow}</p><h2>{t.contact.success.split(",")[0]} {success.data.firstName},<br/><em>{ui.successTitle}</em></h2><p>{ui.successText}</p><dl className="request-summary"><div><dt>{ui.yourDestination}</dt><dd>{destinations.find(item => item.slug === success.data.destination)?.name || ui.toDefine}</dd></div><div><dt>{ui.yourTravellers}</dt><dd>{success.data.travellers} {success.data.travellers > 1 ? ui.travellers : ui.traveller}</dd></div><div><dt>{ui.yourDate}</dt><dd>{success.data.startDate ? new Date(`${success.data.startDate}T12:00:00Z`).toLocaleDateString(dateLocale) : ui.toDefine}</dd></div></dl><div className="request-reference">{ui.yourReference} <strong>{success.reference}</strong></div><div className="success-actions"><a className="button button-terra" href={`mailto:${site.email}?subject=${encodeURIComponent(`${ui.emailSubjectPrefix} ${success.reference}`)}&body=${encodeURIComponent(summary())}`}><Mail size={17}/>{ui.emailProject}<ArrowUpRight size={17}/></a><a className="button button-light" href={`https://wa.me/2290167045407?text=${encodeURIComponent(summary())}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/>{ui.whatsappOpen}<ArrowUpRight size={17}/></a><button className="button button-light" onClick={async () => { try { await navigator.clipboard.writeText(summary()); setCopied(true); } catch { setGeneralError(ui.copyError); } }}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? ui.copiedSummary : ui.copySummary}</button></div>{generalError && <p className="form-error">{generalError}</p>}<button className="success-reset" onClick={() => { setSuccess(null); setErrors({}); setGeneralError(""); setCopied(false); setMessageLength(0); requestKey.current = null; }}>{ui.successReset}</button></div></div>;

  return <form ref={form} className="form-card signature-form" onSubmit={submit} noValidate aria-label={ui.submit}>
    <div className="form-card-heading"><div><span className="form-intro-tag">{ui.formEyebrow}</span><h2>{ui.formHeading}</h2><p>{ui.formRequired}</p></div><span className="form-heading-icon"><Send size={25} strokeWidth={1.3}/></span></div>
    {selectedCircuit && <div className="form-context">{ui.formInspiration} <strong>{selectedCircuit.name}</strong>, {selectedCircuit.duration}</div>}
    {stopNames.length > 0 && <div className="form-context">{ui.atlasSelected} : <strong>{stopNames.join(" · ")}</strong></div>}
    <fieldset className="form-part" disabled={pending}><legend><span>01</span>{ui.step1}</legend><div className="form-grid"><div className="form-field"><label htmlFor="firstName">{fieldsLabels.firstName} *</label><input id="firstName" name="firstName" autoComplete="given-name" placeholder={ui.phFirstName} required maxLength={80} {...validity("firstName")}/>{errorFor("firstName")}</div><div className="form-field"><label htmlFor="lastName">{fieldsLabels.lastName} *</label><input id="lastName" name="lastName" autoComplete="family-name" placeholder={ui.phLastName} required maxLength={80} {...validity("lastName")}/>{errorFor("lastName")}</div><div className="form-field"><label htmlFor="email">{fieldsLabels.email} *</label><input id="email" name="email" type="email" autoComplete="email" spellCheck={false} placeholder={ui.phEmail} required maxLength={254} {...validity("email")}/>{errorFor("email")}</div><div className="form-field"><label htmlFor="phone">{fieldsLabels.phone} <span>({t.form.optional})</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder={ui.phPhone} maxLength={29} {...validity("phone")}/>{errorFor("phone")}</div></div></fieldset>
    <fieldset className="form-part" disabled={pending}><legend><span>02</span>{ui.step2}</legend><div className="form-grid"><div className="form-field form-full"><label htmlFor="destination">{fieldsLabels.destination} *</label><select id="destination" name="destination" defaultValue={destination} required {...validity("destination")}><option value="a-definir">{ui.toDefine}</option>{destinations.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select>{errorFor("destination")}</div><div className="form-field"><label htmlFor="startDate">{fieldsLabels.startDate} <span>({t.form.optional})</span></label><input id="startDate" name="startDate" type="date" min={new Date().toISOString().slice(0,10)} defaultValue={initialStartDate} {...validity("startDate")}/>{errorFor("startDate")}</div><div className="form-field"><label htmlFor="travellers">{fieldsLabels.travellers} *</label><input id="travellers" name="travellers" type="number" min={1} max={30} step={1} defaultValue={initialTravellers >= 1 && initialTravellers <= 30 ? initialTravellers : 2} required {...validity("travellers")}/>{errorFor("travellers")}</div></div></fieldset>
    <fieldset className="form-part" disabled={pending}><legend><span>03</span>{ui.step3}</legend><div className="form-field"><label htmlFor="message">{fieldsLabels.message} <span>({t.form.optional})</span></label><textarea id="message" name="message" rows={4} maxLength={4000} defaultValue={prefillMessage} onChange={event => setMessageLength(event.currentTarget.value.length)} placeholder={ui.phMessage} {...validity("message")}/>{errorFor("message")}<span className="form-character-count">{messageLength} / 4 000</span></div></fieldset>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">{t.form.optional}</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
    <label className="form-checkbox"><input name="consent" type="checkbox" required disabled={pending} {...validity("consent")}/><span>{ui.consent} <Link href="/confidentialite">{ui.privacyMore}</Link> *</span></label>{errorFor("consent")}
    <div className="preview-note"><Info size={15}/><p>{ui.previewNote}</p></div>
    {generalError && <div className="form-error" role="alert">{generalError}</div>}{errors.requestKey && <p className="form-error" role="alert">{errors.requestKey}</p>}
    <button className="button button-terra form-submit" type="submit" disabled={pending}>{pending ? ui.submitting : ui.submit}{pending ? <LoaderCircle className="spin" size={18}/> : <ArrowUpRight size={19}/>}</button><p className="form-bottom-note"><LockKeyhole size={12}/>{ui.bottomNote}</p>
  </form>;
}
