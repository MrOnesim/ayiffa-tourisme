import { test, expect } from "@playwright/test";

test("Photographic scenes pause behind the film and resume on return", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Suivre le rythme de l’eau", exact: true }).click();
  const journey = page.locator(".experience-journey");
  await expect(journey).toHaveAttribute("data-photo-running", "true");
  await page.getByRole("button", { name: "Ouvrir le film du Bénin", exact: true }).click();
  await expect(page.locator(".cinema-dialog")).toBeVisible();
  await expect(journey).toHaveAttribute("data-photo-running", "false");
  await page.getByRole("button", { name: "Fermer le film", exact: true }).click();
  await expect(page.locator(".cinema-dialog")).not.toBeVisible();
  await expect(journey).toHaveAttribute("data-photo-running", "true");
});
