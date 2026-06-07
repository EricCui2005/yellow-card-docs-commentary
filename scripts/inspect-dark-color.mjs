import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto('https://docs.yellowcard.engineering/docs/getting-started', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3500);
const probes = await page.evaluate(() => {
  const get = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { sel, color: cs.color, fontSize: cs.fontSize, fontWeight: cs.fontWeight, tag: el.tagName };
  };
  return [
    get('main p'),
    get('article p'),
    get('h1'),
    get('h2'),
    get('h3'),
    get('main li'),
    get('main'),
    get('body'),
  ].filter(Boolean);
});
console.log(JSON.stringify(probes, null, 2));
await browser.close();
