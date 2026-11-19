import { destinations, circuits } from "./content";

export type TravelRequestPayload = {
  firstName:string; lastName:string; email:string; phone:string; destination:string;
  startDate:string; travellers:number; message:string; circuit:string; consent:boolean;
  website:string; requestKey:string;
};
export type FormErrors = Partial<Record<keyof TravelRequestPayload,string>>;
export function validateTravelRequest(input:unknown):{data:TravelRequestPayload;errors:FormErrors;valid:boolean}{
  const raw = typeof input==="object"&&input!==null ? input as Record<string,unknown> : {};
  const text=(key:string)=>typeof raw[key]==="string"?(raw[key] as string).trim():"";
  const data:TravelRequestPayload={firstName:text("firstName"),lastName:text("lastName"),email:text("email").toLowerCase(),phone:text("phone"),destination:text("destination"),startDate:text("startDate"),travellers:typeof raw.travellers==="number"?raw.travellers:Number.NaN,message:text("message"),circuit:text("circuit"),consent:raw.consent===true,website:text("website"),requestKey:text("requestKey")};
  const errors:FormErrors={};
  if(data.firstName.length<2||data.firstName.length>80)errors.firstName="Indiquez votre prénom (2 à 80 caractères).";
  if(data.lastName.length<2||data.lastName.length>80)errors.lastName="Indiquez votre nom (2 à 80 caractères).";
  if(data.email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email))errors.email="Indiquez une adresse e-mail valide.";
  if(data.phone&&!/^\+?[\d\s().-]{6,28}$/.test(data.phone))errors.phone="Indiquez un numéro valide, avec l’indicatif du pays.";
  if(!["a-definir",...destinations.map(d=>d.slug)].includes(data.destination))errors.destination="Choisissez une destination ou « À définir ensemble ».";
  if(!Number.isInteger(data.travellers)||data.travellers<1||data.travellers>30)errors.travellers="Indiquez un nombre de voyageurs entre 1 et 30.";
  if(data.startDate){
    const date=new Date(`${data.startDate}T12:00:00Z`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(data.startDate)||Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==data.startDate)errors.startDate="Indiquez une date valide.";
    else if(data.startDate<new Date().toISOString().slice(0,10))errors.startDate="Choisissez une date à partir d’aujourd’hui.";
    else if(date.getUTCFullYear()>new Date().getUTCFullYear()+5)errors.startDate="Choisissez une date dans les cinq prochaines années.";
  }
  if(data.message.length>4000)errors.message="Votre message ne doit pas dépasser 4 000 caractères.";
  if(data.circuit&&!circuits.some(c=>c.slug===data.circuit))errors.circuit="Ce circuit n’est pas reconnu. Rechargez la page.";
  if(!data.consent)errors.consent="Votre accord est nécessaire pour enregistrer votre demande.";
  if(data.website)errors.website="La demande n’a pas pu être validée.";
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.requestKey))errors.requestKey="Rechargez la page puis réessayez.";
  return {data,errors,valid:Object.keys(errors).length===0};
}
