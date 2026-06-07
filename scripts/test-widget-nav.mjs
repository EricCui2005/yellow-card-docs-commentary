import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/');
await page.evaluate(() => localStorage.setItem('theme', 'dark'));

await page.goto('http://localhost:3000/docs/go-live-api', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
await page.locator('.commentary-tour-trigger').click();
await page.waitForTimeout(300);
await page.locator('.commentary-tour-start').click();
await page.waitForTimeout(1500);

// Screenshot the tour widget with the new Prev/Next row
await page.screenshot({ path: '/tmp/widget-step1.png' });

// Use the WIDGET's Next button (not the popover's)
const widgetNext = page.locator('.commentary-tour-nav-btn--primary');
for (let i = 0; i < 3; i++) {
  await widgetNext.click();
  await page.waitForTimeout(1100);
  const s = await page.evaluate(() => ({
    url: location.pathname,
    step: document.querySelector('.commentary-tour-step')?.textContent?.trim(),
  }));
  console.log(`widget-next click ${i + 1}: ${JSON.stringify(s)}`);
}
await page.screenshot({ path: '/tmp/widget-step4.png' });

// And Prev from the widget
const widgetPrev = page.locator('.commentary-tour-nav-btn').first();
await widgetPrev.click();
await page.waitForTimeout(900);
const back = await page.evaluate(() => ({
  url: location.pathname,
  step: document.querySelector('.commentary-tour-step')?.textContent?.trim(),
}));
console.log(`widget-prev: ${JSON.stringify(back)}`);

await browser.close();
