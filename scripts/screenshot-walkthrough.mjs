// Capture the walkthrough widget across both sections to verify:
//   1. Idle pill on a /docs/* page (scope defaults to Guides)
//   2. Expanded panel on /docs/* — scope selector + Guides counts
//   3. Idle pill on a /reference/* page (scope defaults to API Reference)
//   4. Expanded panel on /reference/* — scope selector + Reference counts
//   5. Expanded panel after switching scope to Global — totals across both
//   6. An in-page marker on a reference endpoint
import { chromium } from 'playwright';

const browser = await chromium.launch();

async function newPage(theme = 'light') {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme === 'dark' ? 'dark' : 'light',
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/');
  await page.evaluate((t) => localStorage.setItem('theme', t), theme);
  return { ctx, page };
}

async function shootClip(page, file, clip) {
  await page.screenshot({ path: file, clip });
  console.log('saved', file);
}

// 1. /docs/* idle
{
  const { ctx, page } = await newPage();
  await page.goto('http://localhost:3000/docs/send-cross-border-remittances', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(1500);
  await shootClip(page, '/tmp/walk-docs-idle.png', {
    x: 900, y: 100, width: 520, height: 200,
  });

  // 2. /docs/* expanded
  await page.locator('.commentary-tour-trigger').click();
  await page.waitForTimeout(300);
  await shootClip(page, '/tmp/walk-docs-expanded.png', {
    x: 900, y: 100, width: 520, height: 700,
  });

  // 5. switch to Global scope while still expanded
  await page.getByRole('tab', { name: 'Global' }).click();
  await page.waitForTimeout(200);
  await shootClip(page, '/tmp/walk-global-scope.png', {
    x: 900, y: 100, width: 520, height: 700,
  });

  await ctx.close();
}

// 3. /reference/* idle
{
  const { ctx, page } = await newPage();
  await page.goto('http://localhost:3000/reference/get-channels', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(1500);
  await shootClip(page, '/tmp/walk-ref-idle.png', {
    x: 900, y: 100, width: 520, height: 200,
  });

  // 4. /reference/* expanded
  await page.locator('.commentary-tour-trigger').click();
  await page.waitForTimeout(300);
  await shootClip(page, '/tmp/walk-ref-expanded.png', {
    x: 900, y: 100, width: 520, height: 700,
  });

  await ctx.close();
}

// 6. marker on a reference page
{
  const { ctx, page } = await newPage();
  await page.goto('http://localhost:3000/reference/get-channels', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(1500);
  // Click a marker to open its popover
  const marker = page.locator('.commentary-marker').first();
  await marker.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await marker.click();
  await page.waitForTimeout(500);
  await shootClip(page, '/tmp/walk-ref-marker.png', {
    x: 0, y: 200, width: 1440, height: 600,
  });
  await ctx.close();
}

await browser.close();
