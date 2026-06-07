// Quick verify: bumped banner + widget showing on the home page.
import { chromium } from 'playwright';

const browser = await chromium.launch();

async function shoot(theme, file, clip) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme === 'dark' ? 'dark' : 'light',
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/');
  await page.evaluate((t) => localStorage.setItem('theme', t), theme);
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: file, clip });
  console.log('saved', file);
  await ctx.close();
}

await shoot('light', '/tmp/home-banner-light.png', { x: 0, y: 0, width: 1440, height: 220 });
await shoot('dark', '/tmp/home-banner-dark.png', { x: 0, y: 0, width: 1440, height: 220 });
// Widget on home page
await shoot('light', '/tmp/home-widget.png', { x: 1100, y: 100, width: 340, height: 200 });

await browser.close();
