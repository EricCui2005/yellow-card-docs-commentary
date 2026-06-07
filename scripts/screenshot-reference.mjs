import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const slug of ['submit-payment', 'get-channels', 'list-settlements']) {
  await page.goto(`http://localhost:3000/reference/${slug}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `/tmp/ref-${slug}.png`, fullPage: false });
  console.log(`saved /tmp/ref-${slug}.png`);
}
await browser.close();
