require('tsx/cjs');
const path = require('node:path');
const { chromium } = require('playwright');
const fs = require('node:fs');
const { ACTIVITY_MANIFEST: manifest } = require('../lib/homepage/manifest.ts');
const output = path.join(__dirname, '../docs/homepage-review/booking-verification.json');
fs.mkdirSync(path.dirname(output), { recursive: true });

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const records = [];
  const candidates = manifest.filter(activity => activity.eligibility === 'ready');
  for (let offset = 0; offset < candidates.length; offset += 3) {
    await Promise.all(candidates.slice(offset, offset + 3).map(async activity => {
      const page = await browser.newPage();
      try {
        await page.goto(activity.bookingUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForFunction(() => /Select Class|Select Appointment|not currently available|No times|No appointments|There are no|There are currently/i.test(document.body.innerText), { timeout: 18000 }).catch(() => {});
        await page.waitForTimeout(1200);
        const body = await page.locator('body').innerText();
        const normalize = text => text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const titleVisible = normalize(body).includes(normalize(activity.acuityTitle));
        const finalUrl = new URL(page.url());
        const selectedIds = [...finalUrl.searchParams.getAll('appointmentTypeIds[]'), ...finalUrl.searchParams.getAll('appointmentType')];
        const idRetained = selectedIds.includes(String(activity.appointmentTypeId)) || finalUrl.pathname.includes(`/appointment/${activity.appointmentTypeId}/`);
        const noPreselection = !/datetime\//.test(finalUrl.pathname) && !finalUrl.searchParams.has('datetime');
        const notScheduling = /online scheduling is not currently available|there are no appointments|no times are available|no appointments are available/i.test(body);
        records.push({ key: activity.key, title: activity.acuityTitle, appointmentTypeId: activity.appointmentTypeId, city: activity.city, calendarIds: activity.calendarIds, requestedUrl: activity.bookingUrl, finalUrl: page.url(), titleVisible, idRetained, noPreselection, notScheduling, passed: titleVisible && idRetained && noPreselection && !notScheduling });
        console.log(`${titleVisible && idRetained && noPreselection && !notScheduling ? 'PASS' : 'REVIEW'} ${activity.appointmentTypeId} ${activity.title}`);
      } catch (error) {
        records.push({ key: activity.key, appointmentTypeId: activity.appointmentTypeId, passed: false, error: error.name });
        console.log(`REVIEW ${activity.appointmentTypeId}: ${error.name}`);
      } finally { await page.close(); }
    }));
    fs.writeFileSync(output, JSON.stringify(records, null, 2));
  }
  await browser.close();
  console.log('Scheduler verification:', records.filter(record => record.passed).length, '/', records.length);
  if (records.some(record => !record.passed)) process.exitCode = 1;
})().catch(error => { console.error(error.message); process.exitCode = 1; });

