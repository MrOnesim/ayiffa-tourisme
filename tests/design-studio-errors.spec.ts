import { test, expect } from "@playwright/test";

test("A failed preference save is never presented as confirmed and can be retried", async ({ page }) => {
  await page.route("**/api/preferences-design", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "L’enregistrement est temporairement indisponible." }) }));
  await page.goto("/directions-artistiques");
  await page.getByLabel("Ce que vous souhaitez affiner").fill("[test-studio] Vérification d’un échec puis d’une nouvelle tentative.");
  await page.getByRole("button", { name: "Retenir Signature", exact: true }).click();
  await expect(page.locator(".design-save-error")).toContainText("temporairement indisponible");
  await expect(page.locator(".saved-design-choice")).toHaveCount(0);
  await expect(page.locator(".design-save-message")).toHaveCount(0);
  await page.unroute("**/api/preferences-design");
  await page.getByRole("button", { name: "Retenir Signature", exact: true }).click();
  await expect(page.locator(".design-save-message")).toContainText("enregistrée");
  await expect(page.locator(".saved-design-choice")).toContainText("Signature");
  await page.getByRole("button", { name: "Effacer ma préférence enregistrée", exact: true }).click();
  await expect(page.locator(".design-save-message")).toContainText("effacée");
});
