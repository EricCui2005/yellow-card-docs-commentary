// Walk a Global tour starting from a /docs page and confirm that when the
// tour passes the last Guides annotation, navigation crosses into /reference.
import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await ctx.newPage();

const log = (...a) => console.log('[test]', ...a);

await page.goto('http://localhost:3000/');
await page.goto('http://localhost:3000/docs/send-cross-border-remittances', {
  waitUntil: 'domcontentloaded',
});
await page.waitForTimeout(1200);

// Open the panel, switch scope to Global, start Walk Through All.
await page.locator('.commentary-tour-trigger').click();
await page.waitForTimeout(200);
await page.getByRole('tab', { name: 'Global' }).click();
await page.waitForTimeout(200);
await page.getByRole('button', { name: /Walk through all/i }).click();
await page.waitForTimeout(800);

// Verify we're touring; capture step counter.
const touring = await page.locator('.commentary-tour--touring').isVisible();
log('touring:', touring);

async function step(label) {
  const text = await page.locator('.commentary-tour-step-num').textContent();
  const url = page.url();
  log(label, text?.trim(), '|', url);
}

await step('start');

// Step forward via ArrowRight (handled by the popover when touring).
// Two buttons match `Next` in the DOM (popover + tour bar), so a role-based
// click would fail strict-mode; the keyboard path is unambiguous.
for (let i = 0; i < 75; i++) {
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(160);
  if (i === 50 || i === 60 || i === 65) await step(`after ${i + 1} next`);
  if (page.url().includes('/reference/')) {
    await step(`crossed into reference after ${i + 1} next`);
    break;
  }
}

await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/cross-section-after.png', fullPage: false });
log('saved /tmp/cross-section-after.png');

await browser.close();
