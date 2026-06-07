// Capture the full sticky header (disclaimer + top row + nav row) so we
// can confirm the disclaimer strip looks subtle but visible.
import { chromium } from 'playwright';

const browser = await chromium.launch();

async function shoot(theme, file) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 400 },
    colorScheme: theme === 'dark' ? 'dark' : 'light',
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/');
  await page.evaluate((t) => localStorage.setItem('theme', t), theme);
  await page.goto('http://localhost:3000/docs/send-cross-border-remittances', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: file,
    clip: { x: 0, y: 0, width: 1440, height: 200 },
  });
  console.log('saved', file);
  await ctx.close();
}

await shoot('light', '/tmp/header-light.png');
await shoot('dark', '/tmp/header-dark.png');

await browser.close();
