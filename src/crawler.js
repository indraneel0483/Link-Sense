const { chromium } = require('playwright');

async function crawlDomain(domain) {
  const url = domain.startsWith('http') ? domain : `https://${domain}`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });

    // Scroll to bottom to trigger lazy-loaded content (e.g. footer social links)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const links = await page.evaluate(() => {
      const anchors = document.querySelectorAll('a[href]');
      return Array.from(anchors)
        .map(a => a.href)
        .filter(href => href.startsWith('http'));
    });

    const uniqueLinks = [...new Set(links)];
    return uniqueLinks;
  } finally {
    await browser.close();
  }
}

module.exports = { crawlDomain };
