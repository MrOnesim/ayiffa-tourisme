import { test, expect } from "@playwright/test";

const expected = [
  { number: "01", name: "Ganvié", slug: "ganvie" },
  { number: "02", name: "Ouidah", slug: "ouidah" },
  { number: "03", name: "Grand-Popo", slug: "grand-popo" },
  { number: "04", name: "Lac Ahémé", slug: "lac-aheme" },
  { number: "05", name: "Savè", slug: "save" },
];

test("The living atlas contains the five requested escale markers and required copy", async ({ page }, info) => {
  await page.goto("/");
  const atlas = page.locator(".living-atlas");
  await expect(atlas).toBeVisible();
  await expect(atlas.getByRole("heading", { name: "Le Bénin, à la carte." })).toBeVisible();
  await expect(atlas).toContainText("ATLAS VIVANT / CINQ ESCALES");
  await expect(atlas).toContainText("Sélectionnez un repère pour découvrir le lieu et ouvrir sa fiche.");
  await expect(atlas.getByRole("link", { name: "Toutes les destinations", exact: true })).toHaveAttribute("href", "/destinations");
  await expect(atlas).toContainText("NORD · SUD");
  await expect(atlas).toContainText("Carte indicative · Natural Earth");
  await expect(atlas.locator(".atlas-stop")).toHaveCount(5);
  for (const [index, stop] of expected.entries()) {
    const marker = atlas.getByRole("button", { name: `Escale ${stop.number} : ${stop.name}` });
    await expect(marker).toHaveAttribute("aria-pressed", index === 0 ? "true" : "false");
    await expect(marker.locator(".atlas-stop-dot")).toHaveText(stop.number);
    await expect(marker.locator(".atlas-stop-label")).toHaveText(stop.name === "Savè" ? "Savè" : stop.name);
  }
  const mapPaths = await atlas.locator(".map-country").count();
  expect(mapPaths).toBeGreaterThanOrEqual(6);
  await atlas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `.artifacts/atlas-${info.project.name}.png` });
});

test("Selecting a map marker or list item updates the panel and opens the right page", async ({ page }) => {
  await page.goto("/");
  const atlas = page.locator(".living-atlas");
  await atlas.scrollIntoViewIfNeeded();
  await expect(atlas.locator(".atlas-panel h3")).toHaveText("Ganvié");

  await atlas.getByRole("button", { name: "Escale 03 : Grand-Popo" }).click();
  await expect(atlas.locator(".atlas-panel-top")).toContainText("ESCALE 03");
  await expect(atlas.locator(".atlas-panel h3")).toHaveText("Grand-Popo");
  await expect(atlas.getByRole("button", { name: "Escale 03 : Grand-Popo" })).toHaveAttribute("aria-pressed", "true");
  await expect(atlas.locator(".atlas-panel-content .button")).toHaveAttribute("href", "/destinations/grand-popo");
  await expect(atlas.locator(".atlas-panel-list button").nth(2)).toHaveAttribute("aria-pressed", "true");

  await atlas.locator(".atlas-panel-list button").nth(3).click();
  await expect(atlas.locator(".atlas-panel h3")).toHaveText("Lac Ahémé");
  await expect(atlas.locator(".atlas-panel-content .button")).toHaveAttribute("href", "/destinations/lac-aheme");
  await atlas.locator(".atlas-panel-content .button").click();
  await expect(page).toHaveURL(/\/destinations\/lac-aheme$/);
  await expect(page.locator("h1")).toHaveText("Lac Ahémé");
});

test("Atlas markers are keyboard navigable and details remain accessible", async ({ page }) => {
  await page.goto("/");
  const atlas = page.locator(".living-atlas");
  await atlas.scrollIntoViewIfNeeded();
  const first = atlas.getByRole("button", { name: "Escale 01 : Ganvié" });
  await first.focus();
  await expect(atlas.locator(".atlas-panel h3")).toHaveText("Ganvié");
  await page.keyboard.press("ArrowRight");
  await expect(atlas.locator(".atlas-panel h3")).toHaveText("Ouidah");
  await expect(atlas.getByRole("button", { name: "Escale 02 : Ouidah" })).toBeFocused();
  await page.keyboard.press("End");
  await expect(atlas.locator(".atlas-panel h3")).toHaveText("Les collines de Savè");
  await page.keyboard.press("Home");
  await expect(atlas.locator(".atlas-panel h3")).toHaveText("Ganvié");
  expect(await atlas.locator(".atlas-map").evaluate(element => element.getAttribute("role"))).toBe("img");
  expect(await atlas.locator(".atlas-map").evaluate(element => element.querySelector("title") || element.getAttribute("aria-label"))).toBeTruthy();
});

test("Atlas has no horizontal overflow from narrow phones to wide screens", async ({ page }, info) => {
  await page.goto("/");
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    await page.locator(".living-atlas").scrollIntoViewIfNeeded();
    const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
    expect(dimensions.document, `${info.project.name} at ${width}px`).toBeLessThanOrEqual(dimensions.viewport + 1);
    await expect(page.locator(".atlas-panel-content .button")).toBeVisible();
  }
});
