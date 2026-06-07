import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'dark',
});
const page = await ctx.newPage();

// Check several pages, see which actually shows the widget in the DOM
for (const slug of ['getting-started', 'getting-started-1', 'go-live-api', 'networks', 'kyc-metadata']) {
  await page.goto(`http://localhost:3000/docs/${slug}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => {
    const tour = document.querySelector('.commentary-tour');
    const trigger = document.querySelector('.commentary-tour-trigger');
    return {
      tourFound: !!tour,
      triggerFound: !!trigger,
      tourRect: tour ? tour.getBoundingClientRect() : null,
      tourComputed: tour ? {
        position: getComputedStyle(tour).position,
        top: getComputedStyle(tour).top,
        right: getComputedStyle(tour).right,
        zIndex: getComputedStyle(tour).zIndex,
        display: getComputedStyle(tour).display,
        visibility: getComputedStyle(tour).visibility,
      } : null,
    };
  });
  console.log(`${slug}:`, JSON.stringify(info));
}
await browser.close();
