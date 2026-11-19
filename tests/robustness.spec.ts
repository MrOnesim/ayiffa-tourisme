import { randomUUID } from "node:crypto";
import {test,expect} from "@playwright/test";

test("Very small screens, tablet, wide desktop and reduced motion",async({page},testInfo)=>{
  if(testInfo.project.name!=="desktop")return;
  await page.emulateMedia({reducedMotion:"reduce"});
  for(const width of [320,375,768,1024,1920]){
    await page.setViewportSize({width,height:900});
    await page.goto("/");
    await page.evaluate(()=>document.fonts.ready);
    const bounds=await page.locator(".hero h1 em").evaluate(e=>({left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right}));
    expect(bounds.left).toBeGreaterThanOrEqual(0);
    expect(bounds.right,`Hero text must not be clipped at ${width}px`).toBeLessThanOrEqual(width-10);
    expect(await page.locator(".scroll-cue svg").evaluate(e=>getComputedStyle(e).animationName)).toBe("none");
    const sizes=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:window.innerWidth}));
    expect(sizes.page).toBeLessThanOrEqual(sizes.viewport+1);
  }
});

test("Requests are idempotent, rate-limited and validated server-side",async({request},testInfo)=>{
  const data={firstName:"Test",lastName:"Technique",email:`test-ayiffa-api-${testInfo.project.name}-${Date.now()}@example.com`,phone:"",destination:"ganvie",startDate:"",travellers:2,message:"Test de robustesse de la préversion. Ne pas traiter comme un vrai voyage.",circuit:"",consent:true,website:"",requestKey:randomUUID()};
  const first=await request.post("/api/demandes",{data});expect(first.status()).toBe(201);const saved=await first.json();
  const repeated=await request.post("/api/demandes",{data});expect(repeated.status()).toBe(200);expect((await repeated.json()).reference).toBe(saved.reference);
  for(let i=0;i<4;i++)expect((await request.post("/api/demandes",{data:{...data,requestKey:randomUUID()}})).status()).toBe(201);
  expect((await request.post("/api/demandes",{data:{...data,requestKey:randomUUID()}})).status()).toBe(429);
  expect((await request.post("/api/demandes",{data:{...data,startDate:"2020-01-01"}})).status()).toBe(400);
  expect((await request.post("/api/demandes",{data:{...data,travellers:0}})).status()).toBe(400);
  expect((await request.post("/api/demandes",{data:{...data,consent:false}})).status()).toBe(400);
  expect((await request.post("/api/demandes",{data:{...data,website:"spam.example"}})).status()).toBe(400);
  expect((await request.post("/api/demandes",{data,headers:{"sec-fetch-site":"cross-site"}})).status()).toBe(403);
  expect((await request.post("/api/demandes",{data:"plain text",headers:{"Content-Type":"text/plain"}})).status()).toBe(415);
  expect((await request.post("/api/demandes",{data:{...data,message:"A".repeat(25000)}})).status()).toBe(413);
});
