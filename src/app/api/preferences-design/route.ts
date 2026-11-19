import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { designPreferences } from "@/db/schema";
import { isDesignDirection, isDesignReviewToken } from "@/lib/design-directions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const privateHeaders = { "Cache-Control": "private, no-store", Vary: "Authorization" };

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: privateHeaders });
}
function reviewer(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization || !/^Bearer\s+/i.test(authorization)) return null;
  const token = authorization.replace(/^Bearer\s+/i, "");
  return isDesignReviewToken(token) ? createHash("sha256").update(token).digest("hex") : null;
}
function present(row: { direction: string; notes: string; updatedAt: Date }) {
  return { direction: row.direction, notes: row.notes, updatedAt: row.updatedAt.toISOString() };
}
function isCrossSite(request: Request) {
  return request.headers.get("sec-fetch-site") === "cross-site";
}

export async function GET(request: Request) {
  const hash = reviewer(request);
  if (!hash) return reply({ message: "Une clé de préférence valide est nécessaire." }, 401);
  try {
    const [saved] = await db.select({ direction: designPreferences.direction, notes: designPreferences.notes, updatedAt: designPreferences.updatedAt }).from(designPreferences).where(eq(designPreferences.reviewerHash, hash)).limit(1);
    return reply({ preference: saved ? present(saved) : null });
  } catch {
    console.error("Unable to retrieve a design preference.");
    return reply({ message: "Le choix précédent ne peut pas être récupéré pour le moment." }, 503);
  }
}

export async function POST(request: Request) {
  if (isCrossSite(request)) return reply({ message: "Utilisez le formulaire de présentation pour enregistrer votre choix." }, 403);
  const hash = reviewer(request);
  if (!hash) return reply({ message: "Une clé de préférence valide est nécessaire." }, 401);
  if (!request.headers.get("content-type")?.includes("application/json")) return reply({ message: "Le format de la demande n’est pas reconnu." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 8192) return reply({ message: "La note est trop volumineuse." }, 413);
  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 8192) return reply({ message: "La note est trop volumineuse." }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return reply({ message: "La demande n’est pas valide." }, 400);
    input = parsed as Record<string, unknown>;
  } catch { return reply({ message: "La demande n’a pas pu être lue." }, 400); }
  if (!isDesignDirection(input.direction)) return reply({ message: "Choisissez l’une des trois directions présentées." }, 400);
  if (input.notes !== undefined && typeof input.notes !== "string") return reply({ message: "La note doit être un texte." }, 400);
  const notes = typeof input.notes === "string" ? input.notes.trim() : "";
  if (notes.length > 800) return reply({ message: "La note est limitée à 800 caractères." }, 400);
  if (input.website) return reply({ message: "Cette demande ne peut pas être validée." }, 400);
  try {
    const [saved] = await db.insert(designPreferences).values({ reviewerHash: hash, direction: input.direction, notes }).onConflictDoUpdate({ target: designPreferences.reviewerHash, set: { direction: input.direction, notes, updatedAt: new Date() } }).returning({ direction: designPreferences.direction, notes: designPreferences.notes, updatedAt: designPreferences.updatedAt });
    return reply({ preference: present(saved) });
  } catch {
    console.error("Unable to store a design preference.");
    return reply({ message: "Votre choix n’a pas pu être enregistré. Réessayez dans un instant." }, 503);
  }
}

export async function DELETE(request: Request) {
  if (isCrossSite(request)) return reply({ message: "Cette action doit être effectuée depuis la présentation." }, 403);
  const hash = reviewer(request);
  if (!hash) return reply({ message: "Une clé de préférence valide est nécessaire." }, 401);
  try {
    await db.delete(designPreferences).where(eq(designPreferences.reviewerHash, hash));
    return reply({ deleted: true });
  } catch {
    console.error("Unable to delete a design preference.");
    return reply({ message: "Le choix n’a pas pu être effacé. Merci de réessayer." }, 503);
  }
}
