import { test, expect } from "@playwright/test";

const chapterLabels = ["Rencontrer une culture vivante", "Suivre le rythme de l’eau", "Comprendre les histoires de Ouidah", "S’offrir le luxe de ralentir"];

test("Photograph fan lifts on desktop and is navigable on mobile", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator(".departure-card")).toHaveCount(5);
  await page.locator(".departure-fan").scrollIntoViewIfNeeded();
  if (info.project.name === "desktop") {
    const card = page.getByRole("link", { name: "Explorer Ganvié", exact: true });
    await card.hover();
    await expect.poll(() => card.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m42)).toBeLessThan(-25);
    await page.screenshot({ path: ".artifacts/departure-fan-desktop.png" });
  } else {
    await expect(page.getByRole("button", { name: "Inspiration précédente", exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "Inspiration suivante", exact: true }).click();
    await expect(page.locator(".departure-controls > span")).toContainText("02");
    expect(await page.locator(".departure-rail").evaluate(element => element.scrollLeft)).toBeGreaterThan(100);
    await page.screenshot({ path: ".artifacts/departure-fan-mobile.png" });
  }
  await page.getByRole("link", { name: "Explorer Ganvié", exact: true }).click();
  await expect(page).toHaveURL(/\/destinations\/ganvie$/);
  await expect(page.locator("h1")).toHaveText("Ganvié");
});

test("Immersive chapters stack on desktop and swipe on mobile", async ({ page }, info) => {
  await page.goto("/");
  const root = page.locator(".experience-journey");
  const water = page.getByRole("link", { name: chapterLabels[1], exact: true });
  await water.click();
  await expect(water).toHaveAttribute("aria-current", "step");
  if (info.project.name === "desktop") {
    await expect(root).toHaveAttribute("data-layout", "stack");
    await expect.poll(() => page.locator("#experience-panel-1").evaluate(element => Math.abs(element.getBoundingClientRect().top - parseFloat(getComputedStyle(element).top)))).toBeLessThan(3);
    expect(await page.locator("#experience-panel-1").evaluate(element => getComputedStyle(element).position)).toBe("sticky");
    await expect.poll(() => page.locator("#experience-panel-0 .journey-card-surface").evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBeLessThan(.99);
    await page.screenshot({ path: ".artifacts/journey-water-desktop.png" });
    await page.getByRole("link", { name: chapterLabels[3], exact: true }).click();
    await expect(page.getByRole("link", { name: chapterLabels[3], exact: true })).toHaveAttribute("aria-current", "step");
    await expect.poll(() => page.locator("#experience-panel-3").evaluate(element => Math.abs(element.getBoundingClientRect().top - parseFloat(getComputedStyle(element).top)))).toBeLessThan(3);
    await page.screenshot({ path: ".artifacts/journey-coast-desktop.png" });
  } else {
    await expect(root).toHaveAttribute("data-layout", "swipe");
    await expect.poll(() => page.locator(".journey-track").evaluate(element => element.scrollLeft)).toBeGreaterThan(200);
    expect(await page.locator("#experience-panel-1").evaluate(element => getComputedStyle(element).position)).toBe("relative");
    await page.getByRole("button", { name: "Chapitre suivant", exact: true }).click();
    await expect(page.getByRole("link", { name: chapterLabels[2], exact: true })).toHaveAttribute("aria-current", "step");
    await page.getByRole("button", { name: "Chapitre précédent", exact: true }).click();
    await expect(water).toHaveAttribute("aria-current", "step");
    await expect.poll(() => page.locator("#experience-panel-1").evaluate(element => Math.abs(element.getBoundingClientRect().top - ((document.querySelector(".site-header")?.getBoundingClientRect().height || 78) + (document.querySelector(".journey-navigation")?.getBoundingClientRect().height || 52) + 20)))).toBeLessThan(3);
    expect(await page.locator("#experience-panel-1").evaluate(element => element.getBoundingClientRect().bottom)).toBeLessThanOrEqual(await page.evaluate(() => innerHeight));
    await page.screenshot({ path: ".artifacts/journey-water-mobile.png" });
  }
});

test("Chapter photos pause and keyboard navigation remains available", async ({ page }) => {
  await page.goto("/");
  const water = page.getByRole("link", { name: chapterLabels[1], exact: true });
  await water.click();
  const pause = page.getByRole("button", { name: "Mettre les photographies des expériences en pause", exact: true });
  await pause.click();
  await expect(page.locator(".experience-journey")).toHaveAttribute("data-photo-paused", "true");
  await expect(page.locator(".experience-journey")).toHaveAttribute("data-photo-running", "false");
  const image = page.locator(".journey-chapter.is-current .journey-photo.is-visible img");
  expect(await image.evaluate(element => getComputedStyle(element).animationPlayState)).toBe("paused");
  await water.focus();
  await page.keyboard.press("ArrowRight");
  const history = page.getByRole("link", { name: chapterLabels[2], exact: true });
  await expect(history).toBeFocused();
  await expect(history).toHaveAttribute("aria-current", "step");
  await page.keyboard.press("Home");
  await expect(page.getByRole("link", { name: chapterLabels[0], exact: true })).toBeFocused();
  await expect(page.getByRole("link", { name: chapterLabels[0], exact: true })).toHaveAttribute("aria-current", "step");
});

test("Reduced motion offers static scenes without reference-site assets", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const externalAssets: string[] = [];
  page.on("request", request => { if (request.url().includes("visitghana.com")) externalAssets.push(request.url()); });
  await page.goto("/");
  await page.locator(".departure-fan").scrollIntoViewIfNeeded();
  expect(await page.locator(".departure-position").first().evaluate(element => getComputedStyle(element).transform)).toBe("none");
  await page.getByRole("link", { name: chapterLabels[1], exact: true }).click();
  await expect(page.locator(".experience-journey")).toHaveAttribute("data-layout", info.project.name === "desktop" ? "static" : "swipe");
  expect(await page.locator("#experience-panel-1").evaluate(element => getComputedStyle(element).position)).toBe("relative");
  expect(await page.locator("#experience-panel-1 .journey-photo.is-visible img").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  await expect(page.locator(".experience-journey")).toHaveAttribute("data-photo-running", "false");
  await expect(page.getByRole("link", { name: "Découvrir Ganvié", exact: true })).toBeVisible();
  expect(externalAssets).toEqual([]);
});
