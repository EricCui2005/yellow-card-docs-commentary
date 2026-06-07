import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/');
await page.evaluate(() => localStorage.setItem('theme', 'dark'));
await page.goto('http://localhost:3000/docs/getting-started', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1000);
const info = await page.evaluate(() => ({
  htmlClass: document.documentElement.className,
  htmlData: document.documentElement.getAttribute('data-color-mode'),
  bodyBg: getComputedStyle(document.body).backgroundColor,
  h1Color: document.querySelector('h1') ? getComputedStyle(document.querySelector('h1')).color : null,
  p: document.querySelector('p') ? getComputedStyle(document.querySelector('p')).color : null,
  localStorageTheme: localStorage.getItem('theme'),
}));
console.log(JSON.stringify(info, null, 2));
await browser.close();
