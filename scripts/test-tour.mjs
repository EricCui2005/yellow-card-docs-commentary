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

// 1. Closed pill should be visible
await page.screenshot({ path: '/tmp/tour-1-idle.png' });
console.log('1: idle pill');

// 2. Click pill -> expanded panel
await page.locator('.commentary-tour-trigger').click();
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/tour-2-panel.png' });
console.log('2: expanded panel');

// 3. Click "Walk through all N"
await page.locator('.commentary-tour-start').click();
await page.waitForTimeout(700);
await page.screenshot({ path: '/tmp/tour-3-step1.png' });
console.log('3: tour step 1');

// 4. Click Next in the popover
await page.locator('.commentary-nav-btn--primary').click();
await page.waitForTimeout(700);
await page.screenshot({ path: '/tmp/tour-4-step2.png' });
console.log('4: tour step 2');

// 5. Click End tour
await page.locator('.commentary-tour-end').click();
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/tour-5-end.png' });
console.log('5: tour ended');

await browser.close();
