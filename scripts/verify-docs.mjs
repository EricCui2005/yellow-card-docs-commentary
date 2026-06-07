import { chromium } from 'playwright';
const browser = await chromium.launch();
const dark = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: 'dark',
});
const page = await dark.newPage();
// First navigate so localStorage is on localhost origin, then set theme, then visit each
await page.goto('http://localhost:3000/');
await page.evaluate(() => localStorage.setItem('theme', 'dark'));
for (const slug of ['getting-started', 'making-a-collection', 'events-api', 'errors-api', 'payment-reasons-api']) {
  await page.goto(`http://localhost:3000/docs/${slug}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `/tmp/doc-dark-${slug}.png`, fullPage: false });
  console.log(`saved /tmp/doc-dark-${slug}.png`);
}
await browser.close();
