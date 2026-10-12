/**
 * Responsive smoke test against a built Next.js preview.
 * Representative CSS viewport checks are not physical-hardware certification.
 */
import { chromium, webkit } from "playwright";
import fs from "node:fs/promises";

const base = process.env.QA_BASE_URL ?? "http://127.0.0.1:3000";
const engine = process.env.QA_BROWSER ?? "chromium";
const browserType = engine === "webkit" ? webkit : chromium;

const scenarios = [
  { name: "iPhone-compact", w: 320, h: 568, touch: true },
  { name: "iPhone-SE", w: 375, h: 667, touch: true },
  { name: "iPhone-standard", w: 393, h: 852, touch: true },
  { name: "iPhone-Pro-Max", w: 440, h: 956, touch: true },
  { name: "Android-phone", w: 412, h: 915, touch: true },
  { name: "Phone-landscape", w: 844, h: 390, touch: true },
  { name: "iPad-split-view", w: 507, h: 1024, touch: true },
  { name: "iPad-mini-portrait", w: 744, h: 1133, touch: true },
  { name: "iPad-Air-portrait", w: 820, h: 1180, touch: true },
  { name: "iPad-Pro-portrait", w: 1024, h: 1366, touch: true },
  { name: "iPad-landscape", w: 1180, h: 820, touch: true },
  { name: "Small-laptop", w: 1280, h: 720, touch: false },
  { name: "Laptop-1366", w: 1366, h: 768, touch: false },
  { name: "MacBook-1512", w: 1512, h: 982, touch: false },
  { name: "Desktop-1080p", w: 1920, h: 1080, touch: false },
  { name: "Wide-desktop", w: 2560, h: 1440, touch: false },
];
const chosen = engine === "webkit"
  ? scenarios.filter(({ name }) =>
      /iPhone-compact|iPhone-standard|iPhone-Pro-Max|Phone-landscape|iPad-split|iPad-mini|iPad-Air|iPad-Pro|iPad-landscape|Small-laptop/.test(name))
  : scenarios;
const chapters = ["welcome", "celebration", "venue", "memories", "with-love"];
const screenshots = new Set(["iPhone-standard", "iPad-Air-portrait", "iPad-landscape", "Laptop-1366", "Desktop-1080p"]);
await fs.mkdir("device-qa-screenshots", { recursive: true });

let failures = 0;
const browser = await browserType.launch({ headless: true });
try {
  for (const device of chosen) {
    const context = await browser.newContext({
      viewport: { width: device.w, height: device.h },
      deviceScaleFactor: device.touch ? 2 : 1,
      hasTouch: device.touch,
      isMobile: device.touch,
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400 && /\/heritage\//.test(response.url())) {
        errors.push("Artwork HTTP " + response.status() + ": " + response.url());
      }
    });
    try {
      await page.goto(base, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.locator("#welcome").waitFor({ timeout: 25_000 });
      await page.waitForTimeout(350);

      for (const id of chapters) {
        const found = await page.evaluate((targetId) => {
          const target = document.getElementById(targetId);
          if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY + 5);
          return Boolean(target);
        }, id);
        if (!found) throw new Error("Missing #" + id);
        await page.waitForTimeout(200);
        const metrics = await page.evaluate((targetId) => {
          const rect = document.getElementById(targetId)?.getBoundingClientRect();
          return {
            screen: innerWidth,
            rootWidth: document.documentElement.scrollWidth,
            contentHeight: rect?.height ?? 0,
          };
        }, id);
        if (metrics.contentHeight < 70) {
          throw new Error("Collapsed #" + id + " " + JSON.stringify(metrics));
        }
        if (metrics.rootWidth > metrics.screen + 4) {
          throw new Error("Page overflow near #" + id + " " + JSON.stringify(metrics));
        }
        if (screenshots.has(device.name) && (id === "welcome" || id === "with-love")) {
          const path = "device-qa-screenshots/" + engine + "-" + device.name + "-" + id + ".png";
          await page.screenshot({ path, animations: "disabled" });
        }
      }
      const controlCount = await page.locator("a[href], button").count();
      if (controlCount < 6) throw new Error("Interactive controls missing: " + controlCount);
      const headingCount = await page.locator("#celebration-title, #venue-title, #memories-title, #closing-title").count();
      if (headingCount !== 4) throw new Error("Section headings missing: " + headingCount);
      if (errors.length) throw new Error(errors.slice(0, 5).join(" | "));
      console.log("PASS " + engine + " " + device.name + " " + device.w + "x" + device.h);
    } catch (error) {
      failures++;
      console.error("FAIL " + engine + " " + device.name + ": " + (error.stack ?? error));
      const failedShot = "device-qa-screenshots/" + engine + "-" + device.name + "-FAILED.png";
      await page.screenshot({ path: failedShot, animations: "disabled" }).catch(() => {});
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
if (failures) {
  console.error("FAILED " + failures + "/" + chosen.length + " device viewports (" + engine + ")");
  process.exitCode = 1;
} else {
  console.log("PASSED " + chosen.length + " device viewports (" + engine + ")");
}
