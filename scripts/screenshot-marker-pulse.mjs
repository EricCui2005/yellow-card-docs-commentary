// Capture markers mid-pulse. The animation cycles continuously, so we
// take three screenshots ~600ms apart so at least one catches each
// marker near the peak of its halo.
import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('http://localhost:3000/docs/send-cross-border-remittances', {
  waitUntil: 'domcontentloaded',
});
await page.waitForTimeout(2000);

// Scroll so the first cluster of markers is visible.
await page.locator('.commentary-marker').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

for (let i = 0; i < 3; i++) {
  await page.screenshot({
    path: `/tmp/marker-pulse-${i + 1}.png`,
    clip: { x: 220, y: 200, width: 1000, height: 500 },
  });
  console.log(`saved /tmp/marker-pulse-${i + 1}.png`);
  await page.waitForTimeout(700);
}

await browser.close();
