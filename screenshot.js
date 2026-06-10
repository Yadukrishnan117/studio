const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const pages = [
    { url: 'http://localhost:9002/login', name: '01-login' },
    { url: 'http://localhost:9002/dashboard', name: '02-dashboard' },
    { url: 'http://localhost:9002/dashboard/vehicles', name: '03-vehicles' },
    { url: 'http://localhost:9002/dashboard/assets', name: '04-assets' },
    { url: 'http://localhost:9002/dashboard/maintenance', name: '05-maintenance' },
    { url: 'http://localhost:9002/dashboard/finance', name: '06-finance' },
    { url: 'http://localhost:9002/dashboard/reports', name: '07-reports' },
    { url: 'http://localhost:9002/dashboard/settings', name: '08-settings' },
  ];

  for (const p of pages) {
    console.log('Capturing ' + p.url + '...');
    await page.goto(p.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/tmp/screenshots/' + p.name + '.png', fullPage: false });
    console.log('  Saved ' + p.name + '.png');
  }

  await browser.close();
  console.log('Done!');
})();
