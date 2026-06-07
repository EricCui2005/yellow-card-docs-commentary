// Captures the top-right walkthrough widget in three states so we can
// eyeball the new visual prominence:
//   1. idle (collapsed pill)
//   2. expanded panel
//   3. dark-mode idle pill
import { chromium } from 'playwright';

const browser = await chromium.launch();

async function shoot(theme, file, expand) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme === 'dark' ? 'dark' : 'light',
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/');
  await page.evaluate((t) => localStorage.setItem('theme', t), theme);
  await page.goto('http://localhost:3000/docs/send-cross-border-remittances', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(1800);
  if (expand) {
    await page.locator('.commentary-tour-trigger').click();
    await page.waitForTimeout(300);
  }
  // Clip to top-right region where the widget lives.
  await page.screenshot({
    path: file,
    clip: { x: 900, y: 80, width: 520, height: 520 },
  });
  console.log('saved', file);
  await ctx.close();
}

await shoot('light', '/tmp/tour-idle-light.png', false);
await shoot('light', '/tmp/tour-expanded-light.png', true);
await shoot('dark', '/tmp/tour-idle-dark.png', false);

await browser.close();
