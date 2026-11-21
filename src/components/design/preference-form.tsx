"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, CheckCircle2, LoaderCircle, LockKeyhole, RotateCcw } from "lucide-react";
import { DESIGN_STORAGE_KEY, isDesignDirection, isDesignReviewToken, type DesignDirection, type DesignDirectionId, type SavedDesignPreference } from "@/lib/design-directions";
import { getLocalizedDesignDirection } from "@/lib/design-directions-locales";
import { useLocale } from "@/components/locale-provider";

type ApiResult = { preference?: SavedDesignPreference | null; message?: string; deleted?: boolean };

export function DesignPreferenceForm({ direction, onSelect }: { direction: DesignDirection; onSelect: (id: DesignDirectionId) => void }) {
  const { locale, t } = useLocale();
  const studio = t.studio;
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
      catch { if (mounted) setStorageWarning(studio.toastCopyFailed); return; }
      if (!isDesignReviewToken(stored)) return;
      token.current = stored;
      try {
        const response = await fetch("/api/preferences-design", { headers: { Authorization: `Bearer ${stored}` }, cache: "no-store", signal: controller.signal });
        const result: ApiResult = await response.json();
        if (!response.ok) throw new Error(result.message || studio.savedPreference);
        if (mounted && result.preference && isDesignDirection(result.preference.direction)) {
          const preference = result.preference;
          setSaved(preference);
          if (!edited.current.has(preference.direction)) setDrafts(current => ({ ...current, [preference.direction]: preference.notes }));
        }
      } catch (failure) {
        if (mounted && !controller.signal.aborted) setError(failure instanceof Error ? failure.message : studio.savedPreference);
      }
    });
    return () => { mounted = false; controller.abort(); };
  }, [studio.savedPreference, studio.toastCopyFailed]);

  function reviewToken() {
    if (token.current) return token.current;
    const next = crypto.randomUUID();
    token.current = next;
    try { localStorage.setItem(DESIGN_STORAGE_KEY, next); }
    catch { setStorageWarning(studio.shareFallback); }
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
      if (!response.ok || !result.preference || !isDesignDirection(result.preference.direction)) throw new Error(result.message || studio.savedPreference);
      setSaved(result.preference);
      setMessage(`${studio.savedPreference} « ${getLocalizedDesignDirection(selected, locale).name} ». ${studio.compareDisclaimer}`);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : studio.savedPreference);
    } finally { setPending(null); }
  }

  async function erase() {
    if (!token.current || pending) return;
    setPending("delete"); setError(""); setMessage("");
    const currentToken = token.current;
    try {
      const response = await fetch("/api/preferences-design", { method: "DELETE", headers: { Authorization: `Bearer ${currentToken}` } });
      const result: ApiResult = await response.json();
      if (!response.ok || !result.deleted) throw new Error(result.message || studio.erase);
      try { if (localStorage.getItem(DESIGN_STORAGE_KEY) === currentToken) localStorage.removeItem(DESIGN_STORAGE_KEY); } catch { /* The database deletion still succeeded. */ }
      token.current = null;
      if (saved) {
        edited.current.delete(saved.direction);
        setDrafts(current => { const next = { ...current }; delete next[saved.direction]; return next; });
      }
      setSaved(null);
      setMessage(studio.erase);
    } catch (failure) { setError(failure instanceof Error ? failure.message : studio.erase); }
    finally { setPending(null); }
  }

  return <section className="design-preference" aria-labelledby="preference-title">
    <p className="studio-kicker">{studio.formKicker}</p><h2 id="preference-title">{studio.formTitle}</h2>
    <p className="preference-intro">{studio.formIntro}</p>
    {saved && <div className="saved-design-choice"><CheckCircle2 size={16}/><div><span>{studio.savedPreference}</span><strong>{getLocalizedDesignDirection(saved.direction, locale).name}</strong>{saved.direction !== direction.id && <button type="button" onClick={() => onSelect(saved.direction)}>{studio.returnToChoice}<ArrowUpRight size={12}/></button>}</div></div>}
    <form onSubmit={save}>
      <label htmlFor="design-notes">{studio.notesLabel} <span>{studio.notesOptional}</span></label>
      <textarea id="design-notes" name="notes" rows={4} maxLength={800} value={notes} onChange={event => { edited.current.add(direction.id); setDrafts(current => ({ ...current, [direction.id]: event.target.value })); setMessage(""); }} placeholder={studio.notesPlaceholder} aria-describedby="design-notes-hint"/>
      <div className="design-notes-meta"><span id="design-notes-hint">{studio.notesHint}</span><span>{notes.length}/800</span></div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="design-website">{studio.honeypot}</label><input id="design-website" name="website" tabIndex={-1} autoComplete="off"/></div>
      <button className="studio-button preference-save" type="submit" disabled={!!pending || unchanged}>{pending === "save" ? <><LoaderCircle size={16} className="spin"/>{studio.saving}</> : unchanged ? <><Check size={16}/>{studio.savedButton}</> : <>{studio.save} {direction.name}<ArrowUpRight size={16}/></>}</button>
    </form>
    {message && <p className="design-save-message" role="status">{message}</p>}
    {error && <p className="design-save-error" role="alert">{error}</p>}
    {storageWarning && <p className="design-storage-warning">{storageWarning}</p>}
    <p className="design-storage-note"><LockKeyhole size={12}/><span>{studio.note} <Link href="/confidentialite#preferences-design">{studio.privacy}</Link></span></p>
    {saved && <button className="design-erase" onClick={erase} disabled={!!pending}>{pending === "delete" ? <LoaderCircle size={12} className="spin"/> : <RotateCcw size={12}/>}{studio.erase}</button>}
  </section>;
}
