const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ locale: 'zh-CN' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.SIMPLEADMIN_TEST_URL || 'http://127.0.0.1:18080';
    await page.goto(base + '/login.html');
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('admin');
    await page.locator('#loginButton').click();
    await page.waitForURL(base + '/');
    let sequence = 0;
    await page.route('**/api/telemetry', route => {
      const value = ++sequence;
      const time = Date.now();
      return route.fulfill({ json: {
        target: 'www.baidu.com', generation: 0, serverTime: time, mock: true,
        signal: [{ time, rsrpNR: -85, sinrNR: 15, rsrpLTE: null, sinrLTE: null, temperature: 45 }],
        ping: [{ time, rtt: value, jitter: 1, status: 'ok' }],
        summary: { average: value, minimum: value, maximum: value, jitter: 1, loss: 0, received: value, sent: value }
      } });
    });
    for (const section of ['settings', 'network', 'sms', 'deviceinfo', 'console']) {
      await page.goto(base + '/#' + section);
      await page.reload();
      await page.locator('.sa-menu-link[data-page-link="dashboard"]').click();
      const value = page.locator('#monitorSummary .art-stat strong').first();
      await page.waitForFunction(() => /^\d/.test(document.querySelector('#monitorSummary .art-stat strong')?.textContent || ''));
      const previous = await value.textContent();
      await page.waitForFunction(old => document.querySelector('#monitorSummary .art-stat strong').textContent !== old, previous);
      assert.equal(await page.locator('#monitorSummary .art-stat').count(), 4);
      assert.equal(await page.locator('#monitorApp canvas').count(), 3);
      await page.locator('.sa-menu-link[data-page-link="settings"]').click();
      await page.locator('.sa-menu-link[data-page-link="dashboard"]').click();
      assert.equal(await page.locator('#monitorSummary .art-stat').count(), 4);
    }
    assert.deepEqual(errors, []);
    console.log('Five non-dashboard reload routes restore live summary cards and charts');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
