import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: 'dark',
  reducedMotion: 'no-preference',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/');
await page.evaluate(() => localStorage.setItem('theme', 'dark'));

// Start the global tour from getting-started
await page.goto('http://localhost:3000/docs/getting-started', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1000);
await page.locator('.commentary-tour-trigger').click();
await page.waitForTimeout(300);
await page.locator('.commentary-tour-start').click();
await page.waitForTimeout(2000); // give navigation + scroll time

// For each step, record:
//  - is the active marker actually inside the visible (post-header) area?
const sampleSteps = 12;
const results = [];
for (let i = 0; i < sampleSteps; i++) {
  await page.waitForTimeout(1600);
  const r = await page.evaluate(() => {
    const step = document.querySelector('.commentary-tour-step')?.textContent?.trim();
    const all = Array.from(document.querySelectorAll('.commentary-marker'));
    // We need to figure out which one is "active"; the popover has the id
    const popover = document.querySelector('.commentary-popover');
    if (!popover) return { step, status: 'no popover' };
    const id = Array.from(all).find(m => {
      const rect = m.getBoundingClientRect();
      const pr = popover.getBoundingClientRect();
      // popover sits just below the marker
      return Math.abs(rect.left + rect.width - pr.left) < 50 && Math.abs(rect.bottom + 8 - pr.top) < 30;
    })?.dataset.id;
    const active = id ? document.querySelector(`.commentary-marker[data-id="${id}"]`) : null;
    if (!active) return { step, status: 'no marker matched popover', url: location.pathname };
    const r = active.getBoundingClientRect();
    const headerOffset = 140;
    const visibleBottom = window.innerHeight - 80;
    const inComfortableView = r.top >= headerOffset && r.bottom <= visibleBottom;
    return {
      step,
      url: location.pathname,
      markerTop: Math.round(r.top),
      markerBottom: Math.round(r.bottom),
      inComfortableView,
    };
  });
  results.push(r);
  console.log(`step ${i + 1}:`, JSON.stringify(r));
  // Click Next via the widget
  await page.locator('.commentary-tour-nav-btn--primary').click();
}

const ok = results.filter(r => r.inComfortableView).length;
console.log(`\nIn comfortable view: ${ok}/${results.length}`);
await browser.close();
