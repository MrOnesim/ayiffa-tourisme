import { destinations, circuits } from "./content";
import { getDictionary } from "./get-dictionary";
import type { Locale } from "./i18n";

export type TravelRequestPayload = {
  firstName:string; lastName:string; email:string; phone:string; destination:string;
  startDate:string; travellers:number; message:string; circuit:string; consent:boolean;
  website:string; requestKey:string;
};
export type FormErrors = Partial<Record<keyof TravelRequestPayload,string>>;
export function validateTravelRequest(input:unknown, locale:Locale="fr"):{data:TravelRequestPayload;errors:FormErrors;valid:boolean}{
  const m = getDictionary(locale).ui.validation;
  const raw = typeof input==="object"&&input!==null ? input as Record<string,unknown> : {};
  const text=(key:string)=>typeof raw[key]==="string"?(raw[key] as string).trim():"";
  const data:TravelRequestPayload={firstName:text("firstName"),lastName:text("lastName"),email:text("email").toLowerCase(),phone:text("phone"),destination:text("destination"),startDate:text("startDate"),travellers:typeof raw.travellers==="number"?raw.travellers:Number.NaN,message:text("message"),circuit:text("circuit"),consent:raw.consent===true,website:text("website"),requestKey:text("requestKey")};
  const errors:FormErrors={};
  if(data.firstName.length<2||data.firstName.length>80)errors.firstName=m.firstName;
  if(data.lastName.length<2||data.lastName.length>80)errors.lastName=m.lastName;
  if(data.email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email))errors.email=m.email;
  if(data.phone&&!/^\+?[\d\s().-]{6,28}$/.test(data.phone))errors.phone=m.phone;
  if(!["a-definir",...destinations.map(d=>d.slug)].includes(data.destination))errors.destination=m.destination;
  if(!Number.isInteger(data.travellers)||data.travellers<1||data.travellers>30)errors.travellers=m.travellers;
  if(data.startDate){
    const date=new Date(`${data.startDate}T12:00:00Z`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(data.startDate)||Number.isNaN(date.getTime())||date.toISOString().slice(0,10)!==data.startDate)errors.startDate=m.dateInvalid;
    else if(data.startDate<new Date().toISOString().slice(0,10))errors.startDate=m.datePast;
    else if(date.getUTCFullYear()>new Date().getUTCFullYear()+5)errors.startDate=m.dateFuture;
  }
  if(data.message.length>4000)errors.message=m.message;
  if(data.circuit&&!circuits.some(c=>c.slug===data.circuit))errors.circuit=m.circuit;
  if(!data.consent)errors.consent=m.consent;
  if(data.website)errors.website=m.website;
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.requestKey))errors.requestKey=m.requestKey;
  return {data,errors,valid:Object.keys(errors).length===0};
}
