/**
 * iPhone-family parity smoke tests in WebKit.
 * Tests shared features over device CSS viewports/DPR, not exact pixel matching
 * or native iOS hardware performance. No iPhone model gets reduced artwork.
 */
import { webkit } from "playwright";
import fs from "node:fs/promises";

const base = process.env.QA_BASE_URL ?? "http://127.0.0.1:3000";
const models = [
  { name: "compact-320", width: 320, height: 568, dpr: 2 },
  { name: "SE-375", width: 375, height: 667, dpr: 2 },
  { name: "mini-375", width: 375, height: 812, dpr: 3 },
  { name: "notched-390", width: 390, height: 844, dpr: 3 },
  { name: "standard-393", width: 393, height: 852, dpr: 3 },
  { name: "Pro-402", width: 402, height: 874, dpr: 3 },
  { name: "Plus-414", width: 414, height: 896, dpr: 3 },
  { name: "large-428", width: 428, height: 926, dpr: 3 },
  { name: "large-430", width: 430, height: 932, dpr: 3 },
  { name: "large-440", width: 440, height: 956, dpr: 3 },
  { name: "landscape-667", width: 667, height: 375, dpr: 2 },
  { name: "landscape-844", width: 844, height: 390, dpr: 3 },
  { name: "landscape-956", width: 956, height: 440, dpr: 3 },
];
const ids = ["welcome", "celebration", "venue", "memories", "with-love"];
await fs.mkdir("device-qa-screenshots", { recursive: true });
const browser = await webkit.launch({ headless: true });
let failures = 0;
let baseline;

function assert(condition, description) {
  if (!condition) throw new Error(description);
}

try {
  for (const model of models) {
    const context = await browser.newContext({
      viewport: { width: model.width, height: model.height },
      deviceScaleFactor: model.dpr,
      isMobile: true,
      hasTouch: true,
      reducedMotion: "no-preference",
      acceptDownloads: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    try {
      await page.goto(base, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.locator("#welcome").waitFor();
      await page.waitForTimeout(240);
      const invariant = await page.evaluate((chapterIds) => {
        const rect = (node) => {
          if (!node) return null;
          const r = node.getBoundingClientRect();
          return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
        };
        const title = document.querySelector(".heritage-scene__typography h1");
        const card = document.querySelector(".heritage-scene__card");
        return {
          chapterCount: chapterIds.filter(id => document.getElementById(id)).length,
          screenWidth: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          card: rect(card), title: rect(title),
          fontSize: title ? parseFloat(getComputedStyle(title).fontSize) : 0,
          calendar: !!document.querySelector('button[aria-label="Save our date to your calendar"]'),
          photos: document.querySelectorAll("#memories button[aria-label]").length,
          sectionText: chapterIds.map(id => document.getElementById(id)?.textContent?.trim().length ?? 0),
        };
      }, ids);
      assert(invariant.chapterCount === 5, "Five wedding chapters must remain");
      assert(invariant.screenWidth === model.width, "iOS viewport must be device-width");
      assert(invariant.scrollWidth <= model.width + 4, "Horizontal overflow " + JSON.stringify(invariant));
      assert(invariant.fontSize >= 20, "Hero typography unexpectedly shrank");
      assert(invariant.card && invariant.title, "First invitation card and names must exist");
      assert(invariant.title.left >= invariant.card.left - 7 && invariant.title.right <= invariant.card.right + 7,
        "Names escaped the invitation frame: " + JSON.stringify(invariant));
      assert(invariant.calendar, "Save the date button missing");
      assert(invariant.photos >= 3, "Gallery controls missing");
      assert(invariant.sectionText.every(length => length > 30), "Section content missing");
      const same = {
        chapters: invariant.chapterCount,
        calendar: invariant.calendar,
        galleryButtons: invariant.photos,
      };
      if (!baseline) baseline = same;
      else assert(JSON.stringify(same) === JSON.stringify(baseline),
        "Features differ across iPhone models: " + JSON.stringify({ same, baseline }));

      for (const id of ids) {
        await page.evaluate(targetId => {
          const el = document.getElementById(targetId);
          if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY + 5);
        }, id);
        await page.waitForTimeout(85);
        const { screenWidth, rootWidth } = await page.evaluate(() => ({
          screenWidth: innerWidth,
          rootWidth: document.documentElement.scrollWidth,
        }));
        assert(rootWidth <= screenWidth + 4, "Overflow after scrolling to #" + id);
      }

      // Verify the photo viewer is actually interactive, not covered by petals.
      const photo = page.locator("#memories button[aria-label^='View photograph:']").first();
      await photo.scrollIntoViewIfNeeded();
      await photo.click({ timeout: 12_000 });
      await page.getByRole("dialog", { name: "Photo gallery" }).waitFor({ timeout: 8_000 });
      await page.getByRole("button", { name: "Next photo" }).click();
      await page.getByRole("button", { name: "Close photo" }).click();
      assert(await page.getByRole("dialog", { name: "Photo gallery" }).count() === 0,
        "Gallery did not close");

      // Ensure calendar export is available on every iPhone viewport.
      const calendar = page.getByRole("button", { name: "Save our date to your calendar" });
      await calendar.scrollIntoViewIfNeeded();
      const downloadWait = page.waitForEvent("download", { timeout: 12_000 });
      await calendar.click({ timeout: 12_000 });
      const download = await downloadWait;
      assert(download.suggestedFilename().endsWith(".ics"), "Calendar export is not an .ics file");

      assert(errors.length === 0, errors.slice(0, 3).join(" | "));
      if (["compact-320", "mini-375", "standard-393", "Pro-402", "large-440"].includes(model.name)) {
        await page.screenshot({
          path: "device-qa-screenshots/iphone-" + model.name + ".png",
          animations: "disabled",
        });
      }
      console.log("PASS iPhone WebKit " + model.name + " " + model.width + "x" + model.height +
        " @DPR" + model.dpr + ": same chapters, artwork frame, gallery and calendar");
    } catch (error) {
      failures++;
      console.error("FAIL iPhone WebKit " + model.name + ": " + String(error.stack ?? error));
      await page.screenshot({
        path: "device-qa-screenshots/iphone-" + model.name + "-FAILED.png",
        animations: "disabled",
      }).catch(() => {});
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
if (failures) {
  console.error("FAILED " + failures + " of " + models.length + " iPhone parity checks");
  process.exitCode = 1;
} else {
  console.log("PASSED all " + models.length + " iPhone parity checks");
}
