"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, CheckCircle2, LoaderCircle, LockKeyhole, RotateCcw } from "lucide-react";
import { DESIGN_STORAGE_KEY, getDesignDirection, isDesignDirection, isDesignReviewToken, type DesignDirection, type DesignDirectionId, type SavedDesignPreference } from "@/lib/design-directions";

type ApiResult = { preference?: SavedDesignPreference | null; message?: string; deleted?: boolean };

export function DesignPreferenceForm({ direction, onSelect }: { direction: DesignDirection; onSelect: (id: DesignDirectionId) => void }) {
  const token = useRef<string | null>(null);
  const edited = useRef(new Set<DesignDirectionId>());
  const [drafts, setDrafts] = useState<Partial<Record<DesignDirectionId, string>>>({});
  const [saved, setSaved] = useState<SavedDesignPreference | null>(null);
  const [pending, setPending] = useState<"save" | "delete" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [storageWarning, setStorageWarning] = useState("");
  const notes = drafts[direction.id] || "";
  const unchanged = saved?.direction === direction.id && saved.notes === notes.trim();

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    void Promise.resolve().then(async () => {
      let stored: string | null;
      try { stored = localStorage.getItem(DESIGN_STORAGE_KEY); }
      catch { if (mounted) setStorageWarning("Votre navigateur ne permet pas de retrouver ce choix entre deux visites. L’enregistrement reste possible pendant cette visite."); return; }
      if (!isDesignReviewToken(stored)) return;
      token.current = stored;
      try {
        const response = await fetch("/api/preferences-design", { headers: { Authorization: `Bearer ${stored}` }, cache: "no-store", signal: controller.signal });
        const result: ApiResult = await response.json();
        if (!response.ok) throw new Error(result.message || "La préférence précédente est momentanément indisponible.");
        if (mounted && result.preference && isDesignDirection(result.preference.direction)) {
          const preference = result.preference;
          setSaved(preference);
          if (!edited.current.has(preference.direction)) setDrafts(current => ({ ...current, [preference.direction]: preference.notes }));
        }
      } catch (failure) {
        if (mounted && !controller.signal.aborted) setError(failure instanceof Error ? failure.message : "La préférence précédente n’a pas pu être récupérée.");
      }
    });
    return () => { mounted = false; controller.abort(); };
  }, []);

  function reviewToken() {
    if (token.current) return token.current;
    const next = crypto.randomUUID();
    token.current = next;
    try { localStorage.setItem(DESIGN_STORAGE_KEY, next); }
    catch { setStorageWarning("Ce navigateur ne peut pas mémoriser l’identifiant. Une fois le choix enregistré, gardez cette page ouverte pour pouvoir le modifier."); }
    return next;
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || unchanged) return;
    setPending("save"); setError(""); setMessage("");
    const selected = direction.id;
    const payload = { direction: selected, notes: notes.trim(), website: new FormData(event.currentTarget).get("website") || "" };
    try {
      const response = await fetch("/api/preferences-design", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${reviewToken()}` }, body: JSON.stringify(payload) });
      const result: ApiResult = await response.json();
      if (!response.ok || !result.preference || !isDesignDirection(result.preference.direction)) throw new Error(result.message || "Le choix n’a pas pu être enregistré.");
      setSaved(result.preference);
      setMessage(`Préférence « ${getDesignDirection(selected).name} » enregistrée. Le site actuel n’a pas été modifié par cet enregistrement.`);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "La connexion a été interrompue. Réessayez dans un instant.");
    } finally { setPending(null); }
  }

  async function erase() {
    if (!token.current || pending) return;
    setPending("delete"); setError(""); setMessage("");
    const currentToken = token.current;
    try {
      const response = await fetch("/api/preferences-design", { method: "DELETE", headers: { Authorization: `Bearer ${currentToken}` } });
      const result: ApiResult = await response.json();
      if (!response.ok || !result.deleted) throw new Error(result.message || "Le choix n’a pas pu être effacé.");
      try { if (localStorage.getItem(DESIGN_STORAGE_KEY) === currentToken) localStorage.removeItem(DESIGN_STORAGE_KEY); } catch { /* The database deletion still succeeded. */ }
      token.current = null;
      if (saved) {
        edited.current.delete(saved.direction);
        setDrafts(current => { const next = { ...current }; delete next[saved.direction]; return next; });
      }
      setSaved(null);
      setMessage("Votre préférence enregistrée a été effacée.");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "L’effacement n’a pas pu être confirmé."); }
    finally { setPending(null); }
  }

  return <section className="design-preference" aria-labelledby="preference-title">
    <p className="studio-kicker">POUR FAIRE ÉVOLUER L’IDENTITÉ</p><h2 id="preference-title">Votre retour sur la piste.</h2>
    <p className="preference-intro">L’identité globale est déjà appliquée. Vous pouvez conserver un avis ou noter des ajustements ; cet enregistrement ne remplace pas le design en place.</p>
    {saved && <div className="saved-design-choice"><CheckCircle2 size={16}/><div><span>Préférence enregistrée</span><strong>{getDesignDirection(saved.direction).name}</strong>{saved.direction !== direction.id && <button type="button" onClick={() => onSelect(saved.direction)}>Revenir à ce choix<ArrowUpRight size={12}/></button>}</div></div>}
    <form onSubmit={save}>
      <label htmlFor="design-notes">Ce que vous souhaitez affiner <span>(facultatif)</span></label>
      <textarea id="design-notes" name="notes" rows={4} maxLength={800} value={notes} onChange={event => { edited.current.add(direction.id); setDrafts(current => ({ ...current, [direction.id]: event.target.value })); setMessage(""); }} placeholder="Une couleur, une ambiance, une mise en page…" aria-describedby="design-notes-hint"/>
      <div className="design-notes-meta"><span id="design-notes-hint">Quelques indications de style, sans données personnelles.</span><span>{notes.length}/800</span></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="design-website">Laisser vide</label><input id="design-website" name="website" tabIndex={-1} autoComplete="off"/></div>
      <button className="studio-button preference-save" type="submit" disabled={!!pending || unchanged}>{pending === "save" ? <><LoaderCircle size={16} className="spin"/>Enregistrement…</> : unchanged ? <><Check size={16}/>Préférence enregistrée</> : <>Retenir {direction.name}<ArrowUpRight size={16}/></>}</button>
    </form>
    {message && <p className="design-save-message" role="status">{message}</p>}
    {error && <p className="design-save-error" role="alert">{error}</p>}
    {storageWarning && <p className="design-storage-warning">{storageWarning}</p>}
    <p className="design-storage-note"><LockKeyhole size={12}/><span>Un identifiant local sert uniquement à retrouver votre choix sur ce navigateur. <Link href="/confidentialite#preferences-design">Confidentialité</Link></span></p>
    {saved && <button className="design-erase" onClick={erase} disabled={!!pending}>{pending === "delete" ? <LoaderCircle size={12} className="spin"/> : <RotateCcw size={12}/>}Effacer ma préférence enregistrée</button>}
  </section>;
}
