// Confirm the prototype-link annotations render as clickable anchors in the
// commentary popover. Opens each one and screenshots the popover region.
import { chromium } from 'playwright';

const browser = await chromium.launch();

async function openAndShoot(slug, annId, file) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:3000/docs/${slug}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const marker = page.locator(`.commentary-marker[data-id="${annId}"]`);
  await marker.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await marker.click();
  await page.waitForTimeout(500);
  const pop = page.locator('.commentary-popover');
  const box = await pop.boundingBox();
  if (!box) {
    console.log('no popover for', annId);
    await ctx.close();
    return;
  }
  await page.screenshot({
    path: file,
    clip: {
      x: Math.max(0, box.x - 16),
      y: Math.max(0, box.y - 16),
      width: Math.min(1440, box.width + 32),
      height: box.height + 32,
    },
  });
  console.log('saved', file);
  await ctx.close();
}

await openAndShoot('go-live-api', 'gla-sandbox-2', '/tmp/popover-golive.png');
await openAndShoot('authentication-api', 'auth-no-sdk-2', '/tmp/popover-signature.png');

await browser.close();
