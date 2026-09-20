import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
const server = spawn(process.execPath, ['tools/serve.mjs'], { env: { ...process.env, PORT: '4174' }, stdio: 'pipe' });
let browser;
try {
  await new Promise((resolve,reject) => { server.stdout.once('data',resolve); server.once('error',reject); server.once('exit',code=>reject(new Error(`Server exited ${code}`))); });
  browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1100}});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('http://127.0.0.1:4174/study.html');
  await page.waitForFunction(()=>window.artStudy?.ready);
  await page.locator('#enter').click();
  assert.equal(await page.evaluate(()=>window.artStudy.snapshot().scene),'causeway');
  await page.locator('#scene-toggle').click();
  assert.equal(await page.evaluate(()=>window.artStudy.snapshot().scene),'courtyard');
  await page.locator('#scene-toggle').click();
  assert.equal(await page.evaluate(()=>window.artStudy.snapshot().scene),'causeway');
  await page.keyboard.down('KeyD'); await page.waitForFunction(()=>window.artStudy.snapshot().x>=480); await page.keyboard.up('KeyD');
  await page.keyboard.down('KeyD'); await page.keyboard.press('Space');
  await page.waitForFunction(()=>window.artStudy.snapshot().x>630 && window.artStudy.snapshot().grounded);
  await page.waitForFunction(()=>window.artStudy.snapshot().x>=1100); await page.keyboard.up('KeyD');
  await page.keyboard.press('KeyJ'); await page.waitForFunction(()=>window.artStudy.snapshot().hits===1);
  await page.waitForTimeout(400); assert.equal(await page.evaluate(()=>window.artStudy.snapshot().hits),1);
  await mkdir('tmp',{recursive:true}); await page.screenshot({path:'tmp/desktop-study.png',fullPage:true});
  await page.locator('#reset').click(); assert.equal(await page.evaluate(()=>window.artStudy.snapshot().x),240);
  await page.locator('#inspect').click(); assert.equal(await page.locator('#inspect').getAttribute('aria-pressed'),'true');
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  mobile.on('pageerror',e=>errors.push(e.message));
  await mobile.goto('http://127.0.0.1:4174/study.html');await mobile.waitForFunction(()=>window.artStudy?.ready);
  await mobile.locator('#enter').tap();
  const right=mobile.locator('[data-control="right"]');await right.dispatchEvent('pointerdown',{pointerId:1});
  await mobile.waitForFunction(()=>window.artStudy.snapshot().x>270);await right.dispatchEvent('pointerup',{pointerId:1});
  const stopped=await mobile.evaluate(()=>window.artStudy.snapshot().x);await mobile.waitForTimeout(150);
  assert.equal(await mobile.evaluate(()=>window.artStudy.snapshot().x),stopped);
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await mobile.screenshot({path:'tmp/mobile-study.png',fullPage:true});
  await mobile.locator('#scene-toggle').tap();
  assert.equal(await mobile.evaluate(()=>window.artStudy.snapshot().scene),'courtyard');
  await page.goto('http://127.0.0.1:4174/art/library/gallery.html');
  const manifest = JSON.parse(await readFile('art/manifest.json', 'utf8'));
  assert.equal(await page.locator('article').count(),manifest.assets.length);
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>{im.loading='eager';return im.decode();}));});
  await page.goto('http://127.0.0.1:4174/cloister.html');
  await page.waitForFunction(()=>window.cloister?.ready);
  await page.locator('#enter').click();
  await page.keyboard.down('KeyD'); await page.waitForFunction(()=>window.cloister.snapshot().x>300);
  assert.ok((await page.evaluate(()=>window.cloister.snapshot().walk))>0);
  await page.keyboard.up('KeyD');
  assert.equal(await page.locator('#status').textContent(),'BROKEN ARCADE');
  await page.screenshot({path:'tmp/cloister-stage.png',fullPage:true});
  await page.goto('http://127.0.0.1:4174/art/contributions/02-bellwarden-air-attack/v001/preview.html');
  await page.waitForFunction(()=>document.querySelectorAll('.sheet-item').length===6);
  await page.locator('#btn-play').click();
  await page.locator('#btn-scale').click();
  await page.locator('#btn-flip').click();
  await page.locator('#btn-step-next').click();
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr11-preview.png',fullPage:true});
  await page.goto('http://127.0.0.1:4174/art/contributions/05-ember-alpha/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-mode').click();
  await page.locator('#btn-scale').click();
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr12-preview.png',fullPage:true});
  await page.goto('http://127.0.0.1:4174/art/contributions/14-pickups-and-relics/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-mode').click();
  await page.locator('#btn-scale').click();
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr14-preview.png',fullPage:true});
  await page.goto('http://127.0.0.1:4174/art/contributions/11-bell-moth/v002/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-mode').click();
  await page.locator('#btn-flip').click();
  await page.locator('#btn-scale').click();
  for(const id of ['#chk-pivot','#chk-bounds','#chk-border']) await page.locator(id).uncheck();
  await page.waitForTimeout(100);
  const renderedWingspan = await page.evaluate(()=>{
    const c=document.querySelector('#view'),pixels=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    let min=c.width,max=-1;
    for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(pixels[(y*c.width+x)*4+3]>16){min=Math.min(min,x);max=Math.max(max,x);}
    return max-min+1;
  });
  assert.ok(Math.abs(renderedWingspan-64)<=1,'Corrected moth preview must render a 64px visible wingspan');
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr11-moth-preview.png',fullPage:true});
  async function visibleBounds() {
    await page.waitForTimeout(100);
    return page.evaluate(()=>{
      const c=document.querySelector('#view'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
      let x0=c.width,y0=c.height,x1=-1,y1=-1;
      for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>16){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
      return {width:x1-x0+1,height:y1-y0+1};
    });
  }
  await page.goto('http://127.0.0.1:4174/art/contributions/15-mechanisms/v002/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-toggle').click();
  await page.locator('#btn-mode').click();
  await page.locator('#btn-scale').click();
  for(const id of ['#chk-hinge','#chk-pivot','#chk-padding','#chk-hero']) await page.locator(id).uncheck();
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr15-lever-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/12-iron-sexton/v002/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-mode').click();
  await page.locator('#btn-scale').click();
  for(const id of ['#chk-pivot','#chk-grips','#chk-bounds','#chk-hero']) await page.locator(id).uncheck();
  const sextonBounds=await visibleBounds(); assert.ok(Math.abs(sextonBounds.height-160)<=2,'Sexton actual rendered height must be 160');
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr12-sexton-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/13-cistern-lurker/v002/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-mode').click();
  await page.locator('#btn-scale').click();
  for(const id of ['#chk-pivot','#chk-core','#chk-bounds','#chk-hero']) await page.locator(id).uncheck();
  const lurkerBounds=await visibleBounds(); assert.ok(Math.abs(lurkerBounds.width-96)<=2 && Math.abs(lurkerBounds.height-51.57)<=2,`Lurker actual rendered silhouette must preserve 96 by 51.57 proportions: ${JSON.stringify(lurkerBounds)}`);
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr13-lurker-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/16-tollkeeper/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-mode').click();
  await page.locator('#btn-flip').click();
  await page.locator('#btn-scale').click();
  for(const id of ['#chk-pivot','#chk-core','#chk-staff','#chk-border']) await page.locator(id).uncheck();
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr16-tollkeeper-preview.png',fullPage:true});
  await page.goto('http://127.0.0.1:4174/art/contributions/08-ruined-cloister/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  for(const val of ['pier', 'arcade', 'arch']) await page.locator('#sel-module').selectOption(val);
  await page.locator('#btn-scale').click();
  for(const id of ['#chk-pivot','#chk-sockets','#chk-border']) await page.locator(id).uncheck();
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr08-cloister-arcade-kit-preview.png',fullPage:true});
  await page.goto('http://127.0.0.1:4174/art/contributions/world-01-pilgrim-road/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-mode').click();
  await page.locator('#btn-flip').click();
  await page.locator('#btn-scale').click();
  for(const id of ['#chk-sockets','#chk-bounds','#chk-hero','#chk-grid']) await page.locator(id).uncheck();
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/world01-stair-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/world-02-ruined-cloister/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-mode').click();
  await page.locator('#btn-scale').click();
  for(const id of ['#chk-sockets','#chk-bounds','#chk-hero','#chk-grid']) await page.locator(id).uncheck();
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/world02-platform-cap-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/15-mechanisms/v003/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#toggleStateBtn').click();
  for(const value of await page.locator('#viewMode option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#viewMode').selectOption(value);
  }
  for(const value of await page.locator('#bgSelect option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#bgSelect').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr15-grate-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/world-03-flooded-cistern/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#modeThreeBtn').click();
  await page.locator('#modeSceneBtn').click();
  await page.locator('#modeRuntimeBtn').click();
  await page.locator('#modeSingleBtn').click();
  for(const id of ['#showSockets','#showBounds','#showHero','#showLurker']) await page.locator(id).uncheck();
  for(const value of await page.locator('#bgSelect option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#bgSelect').selectOption(value);
  }
  await page.screenshot({path:'tmp/world03-damp-platform-cap-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/world-05-counterweight-works/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#toggleTravelBtn').click();
  await page.locator('#modeSingleBtn').click();
  await page.locator('#modeRuntimeBtn').click();
  await page.locator('#modeShaftBtn').click();
  for(const id of ['#showSockets','#showBounds','#showHero','#showChains']) await page.locator(id).uncheck();
  for(const value of await page.locator('#bgSelect option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#bgSelect').selectOption(value);
  }
  await page.screenshot({path:'tmp/world05-lift-deck-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/world-06-bell-tower/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btnToggleGuides').click();
  await page.locator('#btnToggleHero').click();
  for(const val of ['single', 'climb', 'runtime']) await page.locator('#modeSelect').selectOption(val);
  await page.screenshot({path:'tmp/world06-tower-landing-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/world-04-ossuary-gallery/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btnToggleGuides').click();
  await page.locator('#btnToggleHero').click();
  for(const val of ['single', 'wall', 'runtime']) await page.locator('#modeSelect').selectOption(val);
  await page.screenshot({path:'tmp/world04-niche-panel-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/10-bell-tower/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btnToggleGuides').click();
  await page.locator('#btnToggleHero').click();
  for(const val of ['single', 'belfry', 'runtime']) await page.locator('#modeSelect').selectOption(val);
  await page.screenshot({path:'tmp/job10-bronze-bell-preview.png',fullPage:true});

  await page.goto('http://127.0.0.1:4174/art/contributions/09-flooded-cistern/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-scale-full').click();
  await page.locator('#btn-scale-rt').click();
  await page.locator('#btn-toggle-overlay').click();
  await page.screenshot({path:'tmp/job09-cistern-vault-pier-preview.png',fullPage:true});

  assert.deepEqual(errors,[]);console.log('Desktop movement, gap jump, attack, reset, guides; mobile controls/layout: passed.');
} finally {await browser?.close();server.kill();}
