import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/');
await page.evaluate(() => localStorage.setItem('theme', 'dark'));

// 1. Land on a page with NO annotations (getting-started). Widget should still be there.
await page.goto('http://localhost:3000/docs/getting-started', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
const idleOnEmpty = await page.evaluate(() => {
  const t = document.querySelector('.commentary-tour-trigger');
  return t ? { visible: true, label: t.textContent?.trim(), rect: t.getBoundingClientRect() } : { visible: false };
});
console.log('1: getting-started (empty page):', JSON.stringify(idleOnEmpty));
await page.screenshot({ path: '/tmp/g-1-empty.png' });

// 2. Expand panel: should show GLOBAL count, not 0
await page.locator('.commentary-tour-trigger').click();
await page.waitForTimeout(300);
const expanded = await page.evaluate(() => {
  const counts = Array.from(document.querySelectorAll('.commentary-tour-count-num')).map(e => e.textContent);
  const start = document.querySelector('.commentary-tour-start');
  return { counts, startLabel: start?.textContent?.trim() };
});
console.log('2: expanded counts:', JSON.stringify(expanded));
await page.screenshot({ path: '/tmp/g-2-expanded.png' });

// 3. Start tour: should navigate to first item's page
await page.locator('.commentary-tour-start').click();
await page.waitForTimeout(1500);
console.log('3: after Start, URL:', page.url());
const step1 = await page.evaluate(() => {
  const step = document.querySelector('.commentary-tour-step')?.textContent?.trim();
  const popover = document.querySelector('.commentary-popover');
  return { step, popoverPresent: !!popover, popoverHeader: popover?.querySelector('.commentary-popover-type')?.textContent?.trim() };
});
console.log('   step state:', JSON.stringify(step1));
await page.screenshot({ path: '/tmp/g-3-step1.png' });

// 4. Click Next multiple times, observing same-page and cross-page transitions
for (let i = 0; i < 5; i++) {
  await page.locator('.commentary-nav-btn--primary').click();
  await page.waitForTimeout(1200);
  const s = await page.evaluate(() => {
    const step = document.querySelector('.commentary-tour-step')?.textContent?.trim();
    return { url: location.pathname, step };
  });
  console.log(`4.${i + 1}: ${JSON.stringify(s)}`);
}
await page.screenshot({ path: '/tmp/g-4-after-nexts.png' });

await browser.close();
