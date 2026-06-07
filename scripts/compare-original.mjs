import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
});
const page = await ctx.newPage();
for (const slug of ['submit-payment', 'get-channels', 'list-settlements']) {
  await page.goto(`https://docs.yellowcard.engineering/reference/${slug}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `/tmp/orig-${slug}.png`, fullPage: false });
  console.log(`saved /tmp/orig-${slug}.png`);
}
await browser.close();
