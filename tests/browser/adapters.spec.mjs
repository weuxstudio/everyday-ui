import { test, expect } from "@playwright/test";

for (const adapter of ["react", "svelte"]) {
  const gallery = adapter === "react" ? "/examples/dist/patterns.html" : "/packages/svelte/demo/dist/index.html";
  test.describe(adapter, () => {
    test("installed signup handles repeated submissions and a different error of the same count", async ({ page }) => {
      await page.goto(`/tests/dist/${adapter}/`);
      const email = page.getByLabel("Work email"), password = page.getByLabel("Password", { exact: true });
      const submit = page.getByRole("button", { name: "Create account" }), summary = page.getByRole("alert");
      await password.fill("correct horse battery");
      for (let attempt = 0; attempt < 2; attempt++) {
        await submit.press("Enter");
        await expect(summary).toBeFocused();
        await expect(summary.getByRole("link")).toHaveCount(1);
      }
      await summary.getByRole("link").press("Enter");
      await expect(email).toBeFocused();
      await email.fill("mara@example.com");
      await expect(email).toBeFocused();
      await password.fill("");
      await submit.press("Enter");
      await expect(summary).toBeFocused();
      await summary.getByRole("link").press("Enter");
      await expect(password).toBeFocused();
      await password.fill("correct horse battery");
      await page.getByRole("button", { name: "Show password" }).click();
      await expect(password).toHaveAttribute("type", "text");
      await page.getByRole("checkbox").check();
      expect(await submit.evaluate(el => getComputedStyle(el).height)).toMatch(/^\d+px$/);
      expect(await submit.evaluate(el => getComputedStyle(el).getPropertyValue("--eu-color-accent").trim())).not.toBe("");
      await submit.click();
      await expect(page.getByRole("heading", { name: "Welcome, Mara" })).toBeVisible();
    });

    test("pricing and dashboard use keyboard-selectable periods", async ({ page }) => {
      await page.goto(gallery + "?pattern=pricing");
      await page.getByRole("radio", { name: /Yearly/ }).press("ArrowLeft");
      await expect(page.getByRole("radio", { name: "Monthly" })).toBeChecked();
      await expect(page.getByText("Billed monthly, excl. VAT")).toHaveCount(3);
      await page.goto(gallery + "?pattern=dashboard");
      await page.getByRole("radio", { name: "30 days" }).press("ArrowRight");
      await expect(page.getByRole("radio", { name: "12 months" })).toBeChecked();
    });

    test("settings validates, saves, updates a switch and restores dialog focus", async ({ page }) => {
      await page.goto(gallery + "?pattern=settings");
      const save = page.getByRole("button", { name: "Save profile" });
      await save.click();
      await expect(page.getByRole("alert")).toBeFocused();
      await page.getByLabel("Email", { exact: true }).fill("valid@example.com");
      await save.click();
      await expect(page.getByText("✓ Profile saved")).toBeVisible();
      const setting = page.getByRole("switch").first();
      await setting.press("Space");
      await expect(setting).not.toBeChecked();
      const trigger = page.getByRole("button", { name: "Delete workspace…" });
      await trigger.press("Enter");
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });

    test("checkout preserves delivery and payment choices through confirmation", async ({ page }) => {
      await page.goto(gallery + "?pattern=checkout");
      await page.getByRole("button", { name: "Continue to payment" }).click();
      await expect(page.getByRole("alert").getByRole("link")).toHaveCount(5);
      for (const [id, value] of Object.entries({ email: "mara@example.com", name: "Mara", street: "Markt 2", postcode: "12345", city: "Berlin" })) {
        await page.locator("#co-" + id).fill(value);
      }
      await page.getByRole("radio", { name: /Standard/ }).press("ArrowRight");
      await expect(page.getByRole("radio", { name: /Express/ })).toBeChecked();
      await page.getByRole("button", { name: "Continue to payment" }).click();
      await page.getByRole("radio", { name: /^Invoice/ }).check();
      await page.getByRole("button", { name: "Continue to review" }).click();
      await expect(page.getByText("Invoice (14 days)")).toBeVisible();
      await page.getByRole("button", { name: /Order with obligation/ }).click();
      await expect(page.getByRole("heading", { name: /Thank you/ })).toBeVisible();
    });

    test("invoice search recovers from an empty result", async ({ page }) => {
      await page.goto(gallery + "?pattern=lists-tables");
      await page.getByLabel("Search").fill("missing invoice");
      await expect(page.getByRole("heading", { name: /No invoices match/ })).toBeVisible();
      await page.getByRole("button", { name: "Clear filters" }).first().click();
      await expect(page.getByLabel("Search")).toHaveValue("");
      await page.getByRole("checkbox", { name: "Select all invoices on this page" }).check();
      await expect(page.getByRole("button", { name: "Clear selection" })).toBeVisible();
    });

    test("installed components, motion and sheet use the public entry points", async ({ page }) => {
      await page.goto(`/tests/dist/${adapter}/?contract`);
      await expect(page.getByRole("region", { name: "Order" }).getByText("Paid")).toBeVisible();
      for (const label of ["Delivery hint", "Delivery error", "(optional)"]) await expect(page.getByText(label, { exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Decrease" })).toBeDisabled();
      const increase = page.getByRole("button", { name: "Increase" });
      await increase.click(); await increase.click();
      await expect(page.getByRole("textbox", { name: "Quantity" })).toHaveValue("2");
      await expect(increase).toBeDisabled();
      await page.getByRole("button", { name: "Open sheet" }).press("Enter");
      await expect(page.getByRole("dialog", { name: "Options" })).toBeVisible();
      await page.evaluate(() => history.back());
      await expect(page.getByRole("dialog")).toHaveCount(0);
      const changeItems = page.getByRole("button", { name: "Change items" });
      await changeItems.click();
      await expect(page.getByRole("listitem")).toHaveText(["Two", "One"]);
      await changeItems.click();
      await expect(page.getByRole("listitem")).toHaveText(["One"]);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.getByRole("button", { name: "Change theme" }).click();
      const toggle = page.getByRole("button", { name: "Toggle details" });
      await toggle.click();
      const details = page.getByText("Shipping details");
      await expect(details).toBeVisible();
      expect(await details.evaluate(el => getComputedStyle(el).getPropertyValue("--eu-duration-base").trim())).toBe("80ms");
      await expect(page.getByText("Delivery information")).toBeVisible();
      await toggle.click();
      await expect(details).toHaveCount(0);
      await changeItems.click();
      await expect(page.getByRole("listitem")).toHaveText(["Two", "One"]);
      await changeItems.click();
      await expect(page.getByRole("listitem")).toHaveText(["One"]);
    });
  });
}

test("mobile shell closes via system back", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/skills/everyday-ui/patterns/mobile-app/blueprint.html");
  await page.getByRole("button", { name: "New", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.evaluate(() => history.back());
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
