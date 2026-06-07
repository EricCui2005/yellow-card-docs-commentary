import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/');
await page.evaluate(() => localStorage.setItem('theme', 'dark'));
await page.goto('http://localhost:3000/docs/getting-started-1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
// Scroll to first Webhook notifications callout
await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('strong'));
  const target = els.find(e => e.textContent?.includes('Webhook notifications'));
  if (target) target.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/callout-light.png', fullPage: false });
console.log('saved callout view');

// Now scroll to the JSON error block
await page.evaluate(() => {
  const target = Array.from(document.querySelectorAll('code')).find(c => c.textContent?.includes('SampleErrorCode'));
  if (target) target.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/codetabs.png', fullPage: false });
console.log('saved codetabs view');
await browser.close();
