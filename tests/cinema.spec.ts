import { test, expect } from "@playwright/test";

test("The local film opens, plays, seeks chapters and closes accessibly", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le film du Bénin" }).click();
  const dialog = page.getByRole("dialog", { name: "Le Bénin, intensément." });
  await expect(dialog).toBeVisible();
  const player = page.locator(".cinema-player");
  await expect.poll(() => player.evaluate((element: HTMLVideoElement) => element.readyState), { timeout: 25000 }).toBeGreaterThanOrEqual(2);
  await expect.poll(() => player.evaluate((element: HTMLVideoElement) => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Mettre le film en pause", exact: true }).click();
  expect(await player.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.getByRole("button", { name: "Reprendre le film", exact: true }).click();
  await expect.poll(() => player.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  await dialog.getByRole("button", { name: /Changer de regard/ }).click();
  await expect.poll(() => player.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThanOrEqual(6);
  await expect(dialog.getByRole("button", { name: /Changer de regard/ })).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `.artifacts/cinema-${testInfo.project.name}.png` });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  expect(await player.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(page.getByRole("button", { name: "Ouvrir le film du Bénin" })).toBeFocused();
  await page.getByRole("button", { name: "Regarder le carnet visuel du Bénin" }).click();
  await expect(dialog).toBeVisible();
  await page.getByRole("button", { name: "Fermer le film", exact: true }).click();
  await expect(dialog).not.toBeVisible();
});

test("Autoplay respects reduced motion and mobile data, while explicit film playback works", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const mediaRequests: string[] = [];
  page.on("request", request => { if (request.url().endsWith(".mp4")) mediaRequests.push(request.url()); });
  await page.goto("/");
  await page.waitForTimeout(1200);
  expect(mediaRequests).toHaveLength(0);
  await expect(page.locator(".hero .ambient-video")).not.toHaveAttribute("src", /mp4/);
  const maxTextRight = await page.locator(".hero h1").evaluate(element => Math.max(...Array.from(element.querySelectorAll(".word-inner")).map(word => word.getBoundingClientRect().right)));
  expect(maxTextRight).toBeLessThanOrEqual(await page.evaluate(() => innerWidth - 8));
  await page.getByRole("button", { name: /Voir le carnet de voyage/ }).click();
  await expect(page.locator(".cinema-dialog")).toBeVisible();
  await expect.poll(() => page.locator(".cinema-player").evaluate((video: HTMLVideoElement) => video.readyState), { timeout: 25000 }).toBeGreaterThanOrEqual(2);
  expect(mediaRequests.some(url => url.includes("-hd.mp4"))).toBe(true);
  expect(mediaRequests.some(url => url.includes("-ambient.mp4"))).toBe(false);
  await page.getByRole("button", { name: "Fermer le film" }).click();
});

test("Ambient playback and the moving ribbon can be paused", async ({ page }, testInfo) => {
  await page.goto("/");
  const ambient = page.locator(".hero .ambient-video");
  if (testInfo.project.name === "mobile") {
    await expect(ambient).not.toHaveAttribute("src", /mp4/);
    await page.getByRole("button", { name: "Lire l’ambiance vidéo", exact: true }).click();
  }
  await expect.poll(() => ambient.evaluate((video: HTMLVideoElement) => !video.paused && video.currentTime > 0), { timeout: 25000 }).toBe(true);
  await page.getByRole("button", { name: "Mettre l’ambiance vidéo en pause", exact: true }).click();
  expect(await ambient.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  await page.getByRole("button", { name: "Lire l’ambiance vidéo", exact: true }).click();
  await expect.poll(() => ambient.evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
  const pauseRibbon = page.getByRole("button", { name: "Mettre le ruban animé en pause" });
  await pauseRibbon.scrollIntoViewIfNeeded();
  await pauseRibbon.click();
  await expect(page.locator(".emotion-ribbon")).toHaveAttribute("data-paused", "true");
  expect(await page.locator(".ribbon-track").evaluate(element => getComputedStyle(element).animationPlayState)).toBe("paused");
  await expect.poll(() => ambient.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
});

test("Video assets support local playback and documented attribution", async ({ request }) => {
  const head = await request.head("/videos/benin-carnet-ambient.mp4");
  expect(head.status()).toBe(200);
  expect(head.headers()["content-type"]).toContain("video/mp4");
  expect(Number(head.headers()["content-length"])).toBeLessThan(2500000);
  const range = await request.get("/videos/benin-carnet-hd.mp4", { headers: { Range: "bytes=0-1023" } });
  expect(range.status()).toBe(206);
  const captions = await request.get("/videos/benin-carnet-fr.vtt");
  expect(await captions.text()).toContain("WEBVTT");
  const credits = await request.get("/credits");
  expect(await credits.text()).toContain("mataki klimtetou");
});
