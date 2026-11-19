import {test,expect} from "@playwright/test";

const routes=["/","/destinations","/destinations/ouidah","/destinations/ganvie","/destinations/grand-popo","/destinations/lac-aheme","/destinations/adjarra","/destinations/save","/circuits","/circuits/route-des-esclaves","/circuits/gogotinkpon","/circuits/benin-huit-jours","/circuits/benin-dix-jours","/services","/experiences","/a-propos","/galerie","/contact","/credits","/mentions-legales","/confidentialite","/directions-artistiques"];

test("All pages load with one H1 and no horizontal overflow",async({page},testInfo)=>{
  const exceptions:string[]=[];
  page.on("pageerror",error=>exceptions.push(error.message));
  for(const route of routes){
    const response=await page.goto(route,{waitUntil:"domcontentloaded"});
    expect(response?.status(),route).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    const sizes=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:window.innerWidth}));
    expect(sizes.page,`${route} overflows on ${testInfo.project.name}`).toBeLessThanOrEqual(sizes.viewport+1);
  }
  expect(exceptions).toEqual([]);
});

test("Home interactions, navigation and visual captures",async({page},testInfo)=>{
  await page.goto("/");
  await page.evaluate(()=>document.fonts.ready);
  await page.locator(".hero-image-active img").waitFor();
  await page.waitForFunction(()=>{const i=document.querySelector('.hero-image-active img') as HTMLImageElement;return i?.complete&&i.naturalWidth>0;});
  await page.waitForTimeout(2000);
  await page.screenshot({path:`.artifacts/home-${testInfo.project.name}.png`});
  await page.getByRole("button",{name:"Photographie suivante"}).click();
  await expect(page.locator(".hero-place")).toContainText("Ganvié");
  await page.getByRole("button",{name:"Photographie précédente"}).click();
  await expect(page.locator(".hero-place")).toContainText("Le Bénin en mouvement");
  const experience=page.getByRole("link",{name:"Suivre le rythme de l’eau",exact:true});
  await experience.click();
  await expect(experience).toHaveAttribute("aria-current","step");
  await expect(page.locator("#experience-panel-1")).toBeVisible();
  await page.locator(".gallery-tile").first().click();
  await expect(page.getByRole("dialog",{name:"Galerie photographique du Bénin"})).toBeVisible();
  await page.getByRole("button",{name:"Photo suivante",exact:true}).click();
  await expect(page.locator(".lightbox-caption")).toContainText("Abomey-Calavi");
  await page.keyboard.press("Escape");
  await expect(page.locator(".lightbox")).not.toBeVisible();
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo({top:y,behavior:"instant"});await new Promise(resolve=>setTimeout(resolve,140));}window.scrollTo({top:0,behavior:"instant"});});
  await page.waitForTimeout(1500);
  await page.screenshot({path:`.artifacts/home-full-${testInfo.project.name}.png`,fullPage:true});
  if(testInfo.project.name==="mobile"){
    await page.getByRole("button",{name:"Ouvrir le menu"}).click();
    const menu=page.getByRole("dialog",{name:"Menu de navigation"});
    await expect(menu).toBeVisible();
    await menu.getByRole("link",{name:/Destinations/}).click();
    await expect(page).toHaveURL(/\/destinations$/);
    await expect(menu).not.toBeVisible();
  }
});

test("Destination search, filters and circuit sorting",async({page},testInfo)=>{
  await page.goto("/");
  await page.locator('select[name="destination"]').selectOption("ganvie");
  await page.locator('select[name="voyageurs"]').selectOption("4");
  await page.getByRole("button",{name:"Trouver mon évasion"}).click();
  await expect(page).toHaveURL(/destination=ganvie/);
  await expect(page.locator(".destination-card")).toHaveCount(1);
  await expect(page.locator(".destination-card h3")).toHaveText("Ganvié");
  await expect(page.locator(".selected-trip")).toContainText("4 voyageurs");
  await page.getByRole("button",{name:"Réinitialiser les filtres"}).click();
  await expect(page.locator(".destination-card")).toHaveCount(6);
  await page.getByRole("button",{name:"Évasion & nature",exact:true}).click();
  await expect(page.locator(".destination-card")).toHaveCount(3);
  await page.getByRole("textbox",{name:"Rechercher une destination"}).fill("aucun-lieu-correspondant");
  await expect(page.locator(".empty-state")).toBeVisible();
  await page.getByRole("button",{name:"Voir toutes les destinations"}).click();
  await expect(page.locator(".destination-card")).toHaveCount(6);
  await page.screenshot({path:`.artifacts/destinations-${testInfo.project.name}.png`,fullPage:true});
  await page.goto("/circuits");
  await page.getByRole("combobox").selectOption("long");
  await expect(page.locator(".circuit-card h3").first()).toHaveText("Le Bénin en grand");
  await page.getByRole("button",{name:"Voyage sur mesure",exact:true}).click();
  await expect(page.locator(".circuit-card")).toHaveCount(2);
  await page.locator(".circuit-card h3 a").first().click();
  await expect(page).toHaveURL(/benin-dix-jours/);
  await page.getByRole("link",{name:"Demander mon devis"}).click();
  await expect(page.locator(".form-context")).toContainText("Le Bénin en grand");
});

test("Contact validation and real persisted request",async({page},testInfo)=>{
  await page.goto("/contact?destination=grand-popo&voyageurs=3");
  await expect(page.locator('#destination')).toHaveValue("grand-popo");
  await expect(page.locator('#travellers')).toHaveValue("3");
  await page.screenshot({path:`.artifacts/contact-${testInfo.project.name}.png`,fullPage:true});
  await page.getByRole("button",{name:"Confier mon projet de voyage"}).click();
  await expect(page.locator("#firstName-error")).toBeVisible();
  await expect(page.locator("#email-error")).toBeVisible();
  await page.getByLabel("Prénom *",{exact:true}).fill("Camille");
  await page.getByLabel("Nom *",{exact:true}).fill("Validation");
  await page.getByLabel("Adresse e-mail *").fill(`test-ayiffa-${testInfo.project.name}-${Date.now()}@example.com`);
  await page.locator('#phone').fill("+33 6 12 34 56 78");
  await page.locator('#message').fill("Test technique automatique de la refonte indépendante. Ne pas traiter comme une réservation réelle.");
  await page.locator('input[name="consent"]').check();
  const saved=page.waitForResponse(response=>response.url().includes("/api/demandes")&&response.request().method()==="POST");
  await page.getByRole("button",{name:"Confier mon projet de voyage"}).click();
  const response=await saved;
  expect(response.status()).toBe(201);
  const result=await response.json();
  expect(result.reference).toMatch(/^AYF-[A-F0-9]{8}$/);
  expect(result.delivery).toBe("local-only");
  await expect(page.locator(".form-success h2")).toContainText("votre projet est enregistré");
  await expect(page.locator(".form-success")).toContainText("Elle n’a pas été envoyée automatiquement");
  await expect(page.getByRole("link",{name:/Transmettre mon projet par e-mail/})).toHaveAttribute("href",/^mailto:/);
});

test("API rejects invalid requests and metadata endpoints work",async({request})=>{
  const response=await request.post("/api/demandes",{data:{firstName:"A",email:"invalid"}});
  expect(response.status()).toBe(400);
  const body=await response.json();expect(body.errors.email).toBeTruthy();expect(body.errors.consent).toBeTruthy();
  expect((await request.get("/api/health")).status()).toBe(200);
  const robots=await request.get("/robots.txt");expect(robots.status()).toBe(200);expect(await robots.text()).toContain("Disallow: /");
  const sitemap=await request.get("/sitemap.xml");expect(sitemap.status()).toBe(200);expect(await sitemap.text()).toContain("destinations/ganvie");
  expect((await request.get("/a-page-that-does-not-exist")).status()).toBe(404);
});
