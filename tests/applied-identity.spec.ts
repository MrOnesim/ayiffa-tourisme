import { test, expect } from "@playwright/test";

const identity = "signature-terre-claire";

test("The combined identity is actually applied on public pages", async ({ page }) => {
  for (const route of ["/", "/destinations", "/circuits", "/destinations/ganvie", "/circuits/route-des-esclaves", "/services", "/a-propos", "/contact"]) {
    await page.goto(route);
    await expect(page.locator("body")).toHaveAttribute("data-design", identity);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue("--terracotta").trim())).toBe("#a94f35");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth + 1));
  }
});

test("Signature hero, warm cultural chapter and clear discovery are present", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator(".signature-hero h1")).toContainText("intensément.");
  await expect(page.locator(".signature-discovery")).toBeVisible();
  const primary = page.getByRole("link", { name: "Découvrir nos destinations", exact: true });
  expect(await primary.evaluate(element => getComputedStyle(element).backgroundColor)).toBe("rgb(169, 79, 53)");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `.artifacts/applied-home-${info.project.name}.png` });
  await page.locator(".earth-story-section").scrollIntoViewIfNeeded();
  await expect(page.locator(".earth-story-copy h2")).toContainText("VRAIMENT.");
  const headlineFont = await page.locator(".signature-hero h1").evaluate(element => getComputedStyle(element).fontFamily);
  const earthFont = await page.locator(".earth-story-copy h2").evaluate(element => getComputedStyle(element).fontFamily);
  expect(earthFont).not.toBe(headlineFont);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `.artifacts/applied-earth-${info.project.name}.png` });
  const culture = page.locator(".discovery-shortcuts").getByRole("link", { name: "Culture & patrimoine", exact: true });
  await culture.click();
  await expect(page).toHaveURL(/envie=Culture/);
  await expect(page.getByRole("button", { name: "Culture & patrimoine", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".destination-card")).toHaveCount(1);
});

test("The clear contact form keeps validation and provides a real summary", async ({ page }, info) => {
  await page.goto("/contact?destination=ganvie&voyageurs=3");
  await expect(page.locator(".signature-form fieldset")).toHaveCount(3);
  await expect(page.getByRole("group", { name: /Faisons connaissance/ })).toBeVisible();
  await expect(page.getByRole("group", { name: /Dessinons votre voyage/ })).toBeVisible();
  await expect(page.getByRole("group", { name: /Ce qui compte pour vous/ })).toBeVisible();
  await page.getByLabel("Prénom *", { exact: true }).fill("Camille");
  await page.getByLabel("Nom *", { exact: true }).fill("Validation");
  await page.getByLabel("Adresse e-mail *").fill(`test-ayiffa-applied-${info.project.name}-${Date.now()}@example.com`);
  await page.locator("#message").fill("Test technique automatique de la refonte indépendante — identité appliquée.");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Confier mon projet de voyage", exact: true }).click();
  await expect(page.locator(".request-summary")).toContainText("Ganvié");
  await expect(page.locator(".request-summary")).toContainText("3 personnes");
  await expect(page.locator(".form-success")).toContainText("Elle n’a pas été envoyée automatiquement");
});

test("The design workshop reflects applied status without allowing a preference to replace it", async ({ page }) => {
  await page.goto("/directions-artistiques");
  await expect(page.locator(".studio-applied-status")).toBeVisible();
  await expect(page.locator(".studio-applied-status")).toContainText("Signature, vivante et claire");
  await expect(page.locator(".studio-applied-status")).toContainText("Terre vivante");
  await expect(page.locator(".studio-applied-status")).toContainText("Ligne claire");
  await page.getByRole("tab", { name: /Terre vivante/ }).click();
  await page.locator(".studio-applied-status").getByRole("link", { name: "Voir le site appliqué", exact: true }).click();
  await expect(page.locator("body")).toHaveAttribute("data-design", identity);
  await expect(page.locator(".signature-hero")).toBeVisible();
  await expect(page.locator(".design-studio")).toHaveCount(0);
});
