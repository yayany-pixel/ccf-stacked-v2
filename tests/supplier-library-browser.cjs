const {chromium}=require('playwright');
const assert=require('node:assert/strict');

(async()=>{
  const browser=await chromium.launch({headless:true});
  const url=process.env.SUPPLIER_TEST_URL || 'http://127.0.0.1:3187/team/suppliers';
  try {
    const context=await browser.newContext({httpCredentials:{username:'ccf',password:process.env.SUPPLIER_TEST_PASSWORD || 'local-preview-only'},viewport:{width:1440,height:1000}});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url);await page.locator('.card').first().waitFor();
    assert.equal(await page.locator('.card').count(),65);
    await page.locator('button[data-category="Bonsai"]').click();
    assert.equal(await page.locator('.card:visible').count(),6);
    await page.locator('button[data-category="Pottery & ceramics"]').click();
    await page.locator('#city').selectOption('Chicago');
    assert.equal(await page.locator('.card:visible').count(),3);
    await page.locator('button[data-category="all"]').click();await page.locator('#city').selectOption('all');
    await page.locator('#search').fill('Stephenson white');assert.ok(await page.locator('.card:visible').count()>=2);
    await page.locator('#search').fill('nothingshouldmatch123');assert.equal(await page.locator('#empty').isVisible(),true);
    await page.locator('#search').fill('');await page.locator('#status').selectOption('quote');assert.ok(await page.locator('.card:visible').count()>5);
    await page.locator('#status').selectOption('all');
    const download=page.waitForEvent('download');await page.locator('a[href="?format=csv"]').click();
    assert.equal((await download).suggestedFilename(),'ccf-supplier-directory.csv');
    await page.screenshot({path:'/private/tmp/ccf-suppliers-desktop.png'});
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
    await page.screenshot({path:'/private/tmp/ccf-suppliers-mobile.png'});
    const anon=await browser.newContext();
    for(const suffix of ['','?format=json','?format=csv']) {
      const response=await anon.request.get(url+suffix);
      assert.equal(response.status(),401);
      assert.ok(!(await response.text()).includes('Buy4Store'));
      assert.match(response.headers()['cache-control'],/no-store/);
    }
    assert.deepEqual(errors,[]);
    console.log('Browser checks passed: access protection, 65 resources, category/city/search/status filters, export download, mobile width and JavaScript.');
  } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
