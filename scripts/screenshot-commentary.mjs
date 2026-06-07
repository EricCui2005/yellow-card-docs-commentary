import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/');
await page.evaluate(() => localStorage.setItem('theme', 'dark'));

for (const slug of [
  'go-live-api',
  'send-cross-border-remittances',
  'networks',
  'kyc-metadata',
  'integration-security-guide',
]) {
  await page.goto(`http://localhost:3000/docs/${slug}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `/tmp/comm-${slug}.png`, fullPage: false });
  console.log(`saved /tmp/comm-${slug}.png`);
}

// Try opening a popover
await page.goto('http://localhost:3000/docs/networks', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  const marker = document.querySelector('.commentary-marker');
  if (marker) marker.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(400);
await page.evaluate(() => {
  const marker = document.querySelector('.commentary-marker');
  if (marker) marker.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/comm-popover.png', fullPage: false });
console.log('saved popover');

await browser.close();
