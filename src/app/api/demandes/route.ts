import { randomUUID } from "node:crypto";
import { and, count, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { travelRequests } from "@/db/schema";
import { validateTravelRequest } from "@/lib/validation";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function POST(request:Request){
  if(request.headers.get("sec-fetch-site")==="cross-site")return Response.json({message:"Cette demande doit être envoyée depuis le formulaire du site."},{status:403});
  if(!request.headers.get("content-type")?.includes("application/json"))return Response.json({message:"Format de demande non pris en charge."},{status:415});
  if(Number(request.headers.get("content-length")||0)>24000)return Response.json({message:"Votre demande est trop volumineuse."},{status:413});
  let input:unknown;
  try{
    const text=await request.text();
    if(text.length>24000)return Response.json({message:"Votre demande est trop volumineuse."},{status:413});
    input=JSON.parse(text);
  }catch{return Response.json({message:"Le formulaire n’a pas pu être lu. Veuillez réessayer."},{status:400});}
  const {data,errors,valid}=validateTravelRequest(input);
  if(!valid)return Response.json({message:"Vérifiez les champs indiqués.",errors},{status:400});
  try{
    const [existing]=await db.select({reference:travelRequests.reference}).from(travelRequests).where(eq(travelRequests.requestKey,data.requestKey)).limit(1);
    if(existing)return Response.json({success:true,reference:existing.reference,delivery:"local-only"});
    const [recent]=await db.select({total:count()}).from(travelRequests).where(and(eq(travelRequests.email,data.email),gt(travelRequests.createdAt,new Date(Date.now()-3600000))));
    if(recent.total>=5)return Response.json({message:"Plusieurs demandes ont déjà été enregistrées pour cette adresse. Merci de patienter une heure ou de contacter directement l’agence par e-mail."},{status:429,headers:{"Retry-After":"3600"}});
    const reference=`AYF-${randomUUID().slice(0,8).toUpperCase()}`;
    const [created]=await db.insert(travelRequests).values({requestKey:data.requestKey,reference,firstName:data.firstName,lastName:data.lastName,email:data.email,phone:data.phone||null,destination:data.destination,circuit:data.circuit||null,startDate:data.startDate||null,travellers:data.travellers,message:data.message||null,consent:data.consent}).onConflictDoNothing({target:travelRequests.requestKey}).returning({reference:travelRequests.reference});
    if(!created){
      const [duplicate]=await db.select({reference:travelRequests.reference}).from(travelRequests).where(eq(travelRequests.requestKey,data.requestKey)).limit(1);
      if(duplicate)return Response.json({success:true,reference:duplicate.reference,delivery:"local-only"});
      throw new Error("Insert returned no confirmation");
    }
    return Response.json({success:true,reference:created.reference,delivery:"local-only"},{status:201,headers:{"Cache-Control":"no-store"}});
  }catch(error){
    console.error("Travel request could not be persisted:",error instanceof Error?error.message:"Unknown error");
    return Response.json({message:"L’enregistrement est momentanément indisponible. Votre demande n’est pas confirmée. Réessayez ou écrivez directement à contact@ayiffatourisme.com."},{status:503});
  }
}
