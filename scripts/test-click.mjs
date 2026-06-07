import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/');
await page.evaluate(() => localStorage.setItem('theme', 'dark'));
await page.goto('http://localhost:3000/docs/networks', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);

// Check that markers exist and have been hydrated
const status = await page.evaluate(() => {
  const ms = document.querySelectorAll('.commentary-marker');
  return {
    count: ms.length,
    firstHasIcon: ms[0] ? ms[0].querySelector('svg') !== null : false,
    firstClassList: ms[0] ? Array.from(ms[0].classList) : [],
    firstHasRole: ms[0] ? ms[0].getAttribute('role') : null,
  };
});
console.log('marker status:', JSON.stringify(status));

// Real click via Playwright (not synthetic dispatchEvent)
const firstMarker = await page.locator('.commentary-marker').first();
await firstMarker.scrollIntoViewIfNeeded();
await firstMarker.click();
await page.waitForTimeout(400);

const popover = await page.locator('.commentary-popover').count();
console.log('popover count after click:', popover);
if (popover > 0) {
  const text = await page.locator('.commentary-popover').first().innerText();
  console.log('popover text:', text.substring(0, 200));
}

await page.screenshot({ path: '/tmp/click-test.png', fullPage: false });
await browser.close();
