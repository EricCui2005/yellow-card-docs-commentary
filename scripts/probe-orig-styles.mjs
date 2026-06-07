import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
const page = await ctx.newPage();
await page.goto('https://docs.yellowcard.engineering/docs/getting-started', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);

const probes = await page.evaluate(() => {
  function dump(el, label) {
    if (!el) return { label, missing: true };
    const cs = getComputedStyle(el);
    return {
      label, tag: el.tagName,
      color: cs.color, bg: cs.backgroundColor,
      fontSize: cs.fontSize, fontWeight: cs.fontWeight,
      borderLeft: cs.borderLeftColor + ' / ' + cs.borderLeftWidth,
      borderBottom: cs.borderBottomColor + ' / ' + cs.borderBottomWidth,
      textDecoration: cs.textDecorationLine,
    };
  }
  // Sidebar - active item: find ANY anchor with aria-current=page first, fallback to bg
  const sidebarLinks = Array.from(document.querySelectorAll('nav a'));
  const activeSidebar = document.querySelector('nav a[aria-current="page"]')
    || sidebarLinks.find(a => {
      const cs = getComputedStyle(a);
      return cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
    });
  // Header tabs - find guides/api ref tabs
  const headerTabs = Array.from(document.querySelectorAll('header nav a, [role="tablist"] a'));
  const activeTab = document.querySelector('header a[aria-current="page"], header a[aria-selected="true"]');
  // Main content link
  const mainLink = document.querySelector('main a, article a');
  // Body p
  const p = document.querySelector('main p, article p');
  return {
    sidebarActiveLink: dump(activeSidebar, 'sidebar-active'),
    sidebarLinkCount: sidebarLinks.length,
    activeTab: dump(activeTab, 'header-tab-active'),
    headerTabSample: dump(headerTabs[0], 'header-tab-sample'),
    mainLink: dump(mainLink, 'main-link'),
    mainP: dump(p, 'main-p'),
    h1: dump(document.querySelector('h1'), 'h1'),
    body: dump(document.body, 'body'),
  };
});
console.log(JSON.stringify(probes, null, 2));
await browser.close();
