import { expect, test } from "@playwright/test";

test("guide de style : caché aux moteurs, absent du plan du site, capturé", async ({ page, request }) => {
  const res = await request.get("/guide-de-style");
  expect(res.headers()["x-robots-tag"]).toContain("noindex");
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("guide-de-style");
  for (const [name, width] of [["375", 375], ["1280", 1280]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/guide-de-style");
    await expect(page.getByRole("heading", { level: 1, name: "Guide de style" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `captures/guide-de-style-${name}.png`, fullPage: true });
  }
});
