"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Info, LoaderCircle, LockKeyhole, Mail, MessageCircle, Send } from "lucide-react";
import { site } from "@/lib/content";
import { useContent } from "@/lib/use-content";
import { validateTravelRequest, type FormErrors, type TravelRequestPayload } from "@/lib/validation";

export function TravelForm({ initialDestination = "", initialCircuit = "", initialTravellers = 2, initialStartDate = "" }: { initialDestination?: string; initialCircuit?: string; initialTravellers?: number; initialStartDate?: string }) {
  const { destinations, circuits } = useContent();
  const form = useRef<HTMLFormElement>(null);
  const requestKey = useRef<string | null>(null);
  const successPanel = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<{ reference: string; data: TravelRequestPayload } | null>(null);
  const [copied, setCopied] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const selectedCircuit = circuits.find(circuit => circuit.slug === initialCircuit);
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
    const validation = validateTravelRequest(payload);
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
      if (!response.ok) { setErrors(result.errors || {}); setGeneralError(result.message || "Une erreur est survenue. Merci de réessayer."); return; }
      if (typeof result.reference !== "string" || result.success !== true) throw new Error("Invalid confirmation");
      setSuccess({ reference: result.reference, data: validation.data });
    } catch { setGeneralError("La connexion a été interrompue. Réessayez : votre demande ne sera pas enregistrée deux fois. Vous pouvez aussi contacter l’agence par e-mail."); }
    finally { setPending(false); }
  }

  function summary() {
    if (!success) return "";
    const { data, reference } = success;
    const place = destinations.find(item => item.slug === data.destination)?.name || "À définir ensemble";
    return `Bonjour AYIFFA TOURISME,\n\nJ’ai préparé un projet de voyage sur votre site de présentation (référence ${reference}).\n\nNom : ${data.firstName} ${data.lastName}\nE-mail : ${data.email}${data.phone ? `\nTéléphone : ${data.phone}` : ""}\nDestination : ${place}${selectedCircuit ? `\nCircuit : ${selectedCircuit.name}` : ""}\nVoyageurs : ${data.travellers}\nDate souhaitée : ${data.startDate || "À définir"}\n\n${data.message.slice(0,1800)}\n\nMerci de me contacter pour organiser mon séjour.`;
  }

  if (success) return <div className="form-card signature-form"><div className="form-success" ref={successPanel} tabIndex={-1} role="status"><span className="success-icon"><Check size={28} strokeWidth={1.5}/></span><p className="eyebrow">UNE BELLE HISTOIRE COMMENCE</p><h2>Merci {success.data.firstName},<br/><em>votre projet est enregistré.</em></h2><p>Votre demande a bien été conservée dans cet espace de présentation indépendant. Elle n’a pas été envoyée automatiquement à l’agence. Pour poursuivre l’échange, transmettez votre projet avec l’un des boutons ci-dessous.</p><dl className="request-summary"><div><dt>Votre destination</dt><dd>{destinations.find(item => item.slug === success.data.destination)?.name || "À définir ensemble"}</dd></div><div><dt>Vos voyageurs</dt><dd>{success.data.travellers} personne{success.data.travellers > 1 ? "s" : ""}</dd></div><div><dt>Votre date envisagée</dt><dd>{success.data.startDate ? new Date(`${success.data.startDate}T12:00:00Z`).toLocaleDateString("fr-FR") : "À définir ensemble"}</dd></div></dl><div className="request-reference">Votre référence : <strong>{success.reference}</strong></div><div className="success-actions"><a className="button button-terra" href={`mailto:${site.email}?subject=${encodeURIComponent(`Projet de voyage : ${success.reference}`)}&body=${encodeURIComponent(summary())}`}><Mail size={17}/>Transmettre mon projet par e-mail<ArrowUpRight size={17}/></a><a className="button button-light" href={`https://wa.me/2290167045407?text=${encodeURIComponent(summary())}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/>Ouvrir WhatsApp<ArrowUpRight size={17}/></a><button className="button button-light" onClick={async () => { try { await navigator.clipboard.writeText(summary()); setCopied(true); } catch { setGeneralError("La copie n’est pas disponible dans ce navigateur. Utilisez le bouton e-mail."); } }}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Le récapitulatif est copié" : "Copier mon récapitulatif"}</button></div>{generalError && <p className="form-error">{generalError}</p>}<button className="success-reset" onClick={() => { setSuccess(null); setErrors({}); setGeneralError(""); setCopied(false); setMessageLength(0); requestKey.current = null; }}>Préparer une autre demande</button></div></div>;

  return <form ref={form} className="form-card signature-form" onSubmit={submit} noValidate aria-label="Demande de voyage">
    <div className="form-card-heading"><div><span className="form-intro-tag">VOTRE VOYAGE, EN QUELQUES MOTS</span><h2>Parlons de votre projet.</h2><p>Les champs marqués d’un * sont nécessaires.</p></div><span className="form-heading-icon"><Send size={25} strokeWidth={1.3}/></span></div>
    {selectedCircuit && <div className="form-context">Votre inspiration : <strong>{selectedCircuit.name}</strong>, {selectedCircuit.duration}</div>}
    <fieldset className="form-part" disabled={pending}><legend><span>01</span>Faisons connaissance.</legend><div className="form-grid"><div className="form-field"><label htmlFor="firstName">Prénom *</label><input id="firstName" name="firstName" autoComplete="given-name" placeholder="Votre prénom" required maxLength={80} {...validity("firstName")}/>{errorFor("firstName")}</div><div className="form-field"><label htmlFor="lastName">Nom *</label><input id="lastName" name="lastName" autoComplete="family-name" placeholder="Votre nom" required maxLength={80} {...validity("lastName")}/>{errorFor("lastName")}</div><div className="form-field"><label htmlFor="email">Adresse e-mail *</label><input id="email" name="email" type="email" autoComplete="email" spellCheck={false} placeholder="vous@exemple.com" required maxLength={254} {...validity("email")}/>{errorFor("email")}</div><div className="form-field"><label htmlFor="phone">Téléphone <span>(facultatif)</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Avec l’indicatif du pays" maxLength={29} {...validity("phone")}/>{errorFor("phone")}</div></div></fieldset>
    <fieldset className="form-part" disabled={pending}><legend><span>02</span>Dessinons votre voyage.</legend><div className="form-grid"><div className="form-field form-full"><label htmlFor="destination">Votre destination *</label><select id="destination" name="destination" defaultValue={destination} required {...validity("destination")}><option value="a-definir">À définir ensemble</option>{destinations.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select>{errorFor("destination")}</div><div className="form-field"><label htmlFor="startDate">Date envisagée <span>(facultatif)</span></label><input id="startDate" name="startDate" type="date" min={new Date().toISOString().slice(0,10)} defaultValue={initialStartDate} {...validity("startDate")}/>{errorFor("startDate")}</div><div className="form-field"><label htmlFor="travellers">Nombre de voyageurs *</label><input id="travellers" name="travellers" type="number" min={1} max={30} step={1} defaultValue={initialTravellers >= 1 && initialTravellers <= 30 ? initialTravellers : 2} required {...validity("travellers")}/>{errorFor("travellers")}</div></div></fieldset>
    <fieldset className="form-part" disabled={pending}><legend><span>03</span>Ce qui compte pour vous.</legend><div className="form-field"><label htmlFor="message">Racontez-nous vos envies <span>(facultatif)</span></label><textarea id="message" name="message" rows={4} maxLength={4000} onChange={event => setMessageLength(event.currentTarget.value.length)} placeholder="Vos envies, votre rythme, une occasion particulière… Chaque détail nous aide à imaginer votre voyage." {...validity("message")}/>{errorFor("message")}<span className="form-character-count">{messageLength} / 4 000</span></div></fieldset>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Laissez ce champ vide</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
    <label className="form-checkbox"><input name="consent" type="checkbox" required disabled={pending} {...validity("consent")}/><span>J’accepte l’enregistrement de mes informations pour cette demande de voyage. <Link href="/confidentialite">En savoir plus sur mes données.</Link> *</span></label>{errorFor("consent")}
    <div className="preview-note"><Info size={15}/><p>Version de présentation indépendante : ce formulaire enregistre votre projet, sans envoi automatique à l’agence. Vous pourrez ensuite le transmettre par e-mail ou WhatsApp.</p></div>
    {generalError && <div className="form-error" role="alert">{generalError}</div>}{errors.requestKey && <p className="form-error" role="alert">{errors.requestKey}</p>}
    <button className="button button-terra form-submit" type="submit" disabled={pending}>{pending ? "Enregistrement de votre projet…" : "Confier mon projet de voyage"}{pending ? <LoaderCircle className="spin" size={18}/> : <ArrowUpRight size={19}/>}</button><p className="form-bottom-note"><LockKeyhole size={12}/>Sans engagement. Aucun paiement ni réservation à cette étape.</p>
  </form>;
}
