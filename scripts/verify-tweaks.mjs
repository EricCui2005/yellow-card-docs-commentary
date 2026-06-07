import { chromium } from 'playwright';
const browser = await chromium.launch();
// dark mode + narrow viewport (820px = between md and lg)
for (const [width, label] of [[1440, 'wide'], [820, 'narrow'], [700, 'mobile']]) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  await page.goto('http://localhost:3000/docs/getting-started', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `/tmp/tweaks-${label}-${width}.png`, fullPage: false });
  console.log(`saved /tmp/tweaks-${label}-${width}.png (viewport ${width}px)`);
  await ctx.close();
}
await browser.close();
