import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";
import { DESIGN_STORAGE_KEY } from "../src/lib/design-directions";

test("Three distinct directions, responsive canvas, comparison and real links", async ({ page }, info) => {
  await page.goto("/directions-artistiques");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".site-header")).not.toBeVisible();
  await expect(page.getByRole("tab", { name: /Signature/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".mock-signature")).toBeVisible();
  await page.getByRole("button", { name: "Voir le film depuis la proposition Signature", exact: true }).click();
  await expect(page.locator(".cinema-dialog")).toBeVisible();
  await page.getByRole("button", { name: "Fermer le film", exact: true }).click();
  await expect(page.locator(".cinema-dialog")).not.toBeVisible();
  for (const [name, slug, selector] of [["Signature", "signature", ".mock-signature"], ["Terre vivante", "terre-vivante", ".mock-earth"], ["Ligne claire", "ligne-claire", ".mock-clarity"]]) {
    await page.getByRole("tab", { name: new RegExp(name) }).click();
    await expect(page.locator(selector)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`direction=${slug}`));
    const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
    expect(dimensions.document, name).toBeLessThanOrEqual(dimensions.viewport + 1);
    await page.locator(".studio-preview-toolbar").scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    await page.screenshot({ path: `.artifacts/studio-${slug}-${info.project.name}.png` });
  }
  await page.getByRole("button", { name: "Afficher l’aperçu mobile", exact: true }).click();
  await expect(page.locator(".design-preview")).toHaveAttribute("data-preview-device", "mobile");
  expect((await page.locator(".design-preview").boundingBox())!.width).toBeLessThanOrEqual(391);
  await page.getByRole("button", { name: /Comparer les trois directions/ }).click();
  const dialog = page.getByRole("dialog", { name: "Trois regards sur le Bénin." });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("table")).toBeVisible();
  await dialog.getByRole("button", { name: "Voir Ligne claire", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page.getByRole("combobox", { name: "Destination dans la proposition Ligne claire" }).selectOption("ganvie");
  await page.getByRole("button", { name: "Explorer la destination de l’aperçu" }).click();
  await expect(page).toHaveURL(/\/destinations\?destination=ganvie/);
  await expect(page.locator(".site-header")).toBeVisible();
  await expect(page.locator(".destination-card")).toHaveCount(1);
});

test("Direction tabs support keyboard, palette copying and a real export", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/directions-artistiques");
  const signature = page.getByRole("tab", { name: /Signature/ });
  await signature.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Terre vivante/ })).toBeFocused();
  await expect(page.getByRole("tab", { name: /Terre vivante/ })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Copier la couleur Terre #A94F35", exact: true }).click();
  await expect(page.locator(".studio-toast")).toContainText("#A94F35 copié");
  const exportStarted = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter la fiche de Terre vivante", exact: true }).click();
  const file = await exportStarted;
  expect(file.suggestedFilename()).toBe("ayiffa-direction-terre-vivante.txt");
  await expect(page.locator(".design-preference")).not.toContainText("Préférence enregistrée");
  await page.getByRole("button", { name: /Partager cet aperçu/ }).click();
  await expect(page.locator(".studio-toast")).toContainText("Aucune note privée n’est partagée");
});

test("A design preference persists, updates and can be deleted without applying the theme", async ({ page }) => {
  await page.goto("/directions-artistiques?direction=terre-vivante");
  await page.getByLabel("Ce que vous souhaitez affiner").fill("[test-studio] Garder les couleurs chaleureuses, avec une navigation très claire.");
  await page.getByRole("button", { name: "Retenir Terre vivante", exact: true }).click();
  await expect(page.locator(".design-save-message")).toContainText("Le site actuel n’a pas été modifié");
  const token = await page.evaluate(key => localStorage.getItem(key), DESIGN_STORAGE_KEY);
  expect(token).toBeTruthy();
  await page.reload();
  await expect(page.locator(".saved-design-choice")).toContainText("Terre vivante");
  await expect(page.getByLabel("Ce que vous souhaitez affiner")).toHaveValue(/\[test-studio\]/);
  await page.getByLabel("Ce que vous souhaitez affiner").fill("[test-studio] Note modifiée et enregistrée.");
  await page.getByRole("button", { name: "Retenir Terre vivante", exact: true }).click();
  await expect(page.locator(".design-save-message")).toContainText("enregistrée");
  await page.reload();
  await expect(page.getByLabel("Ce que vous souhaitez affiner")).toHaveValue("[test-studio] Note modifiée et enregistrée.");
  await page.getByRole("button", { name: "Effacer ma préférence enregistrée", exact: true }).click();
  await expect(page.locator(".design-save-message")).toContainText("effacée");
  await expect(page.locator(".saved-design-choice")).toHaveCount(0);
  expect(await page.evaluate(key => localStorage.getItem(key), DESIGN_STORAGE_KEY)).toBeNull();
  await page.goto("/");
  await expect(page.locator(".cinematic-hero")).toBeVisible();
  await expect(page.locator(".design-studio")).toHaveCount(0);
});

test("Reduced motion, small screens and studio metadata remain safe", async ({ page, request }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const media: string[] = [];
  page.on("request", item => { if (item.url().endsWith(".mp4")) media.push(item.url()); });
  await page.goto("/directions-artistiques?direction=signature&format=mobile");
  await expect(page.getByRole("button", { name: "Animations réduites selon vos préférences système" })).toBeDisabled();
  await page.waitForTimeout(500);
  expect(media).toHaveLength(0);
  expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex");
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("directions-artistiques");
  if (info.project.name === "desktop") {
    for (const width of [320, 375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const name of ["Signature", "Terre vivante", "Ligne claire"]) {
        await page.getByRole("tab", { name: new RegExp(name) }).click();
        const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
        expect(dimensions.document, `${name} at ${width}`).toBeLessThanOrEqual(dimensions.viewport + 1);
      }
    }
  }
});

test("Preference API validates requests and isolates reviewer keys", async ({ request }) => {
  const key = randomUUID();
  const headers = { Authorization: `Bearer ${key}` };
  const data = { direction: "signature", notes: "[test-studio] Validation de l’API privée de préférences." };
  expect((await request.get("/api/preferences-design")).status()).toBe(401);
  expect((await request.post("/api/preferences-design", { headers, data: { direction: "unknown" } })).status()).toBe(400);
  expect((await request.post("/api/preferences-design", { headers, data: { ...data, notes: "a".repeat(801) } })).status()).toBe(400);
  expect((await request.post("/api/preferences-design", { headers, data: { ...data, website: "spam.example" } })).status()).toBe(400);
  expect((await request.post("/api/preferences-design", { headers: { ...headers, "sec-fetch-site": "cross-site" }, data })).status()).toBe(403);
  expect((await request.post("/api/preferences-design", { headers: { ...headers, "Content-Type": "text/plain" }, data: "plain text" })).status()).toBe(415);
  const saved = await request.post("/api/preferences-design", { headers, data });
  expect(saved.status()).toBe(200);
  expect((await saved.json()).preference.direction).toBe("signature");
  const own = await request.get("/api/preferences-design", { headers });
  expect(own.headers()["cache-control"]).toContain("no-store");
  expect((await own.json()).preference.notes).toBe(data.notes);
  const stranger = await request.get("/api/preferences-design", { headers: { Authorization: `Bearer ${randomUUID()}` } });
  expect((await stranger.json()).preference).toBeNull();
  await request.post("/api/preferences-design", { headers, data: { ...data, direction: "ligne-claire" } });
  expect((await (await request.get("/api/preferences-design", { headers })).json()).preference.direction).toBe("ligne-claire");
  expect((await request.delete("/api/preferences-design", { headers })).status()).toBe(200);
  expect((await (await request.get("/api/preferences-design", { headers })).json()).preference).toBeNull();
});
