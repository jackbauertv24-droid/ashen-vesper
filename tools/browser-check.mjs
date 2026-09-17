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
  await page.goto('http://127.0.0.1:4174/art/contributions/12-iron-sexton/v001/preview.html');
  await page.evaluate(async()=>{await Promise.all([...document.images].map(im=>im.decode()));});
  await page.locator('#btn-mode').click();
  await page.locator('#btn-scale').click();
  for(const id of ['#chk-pivot','#chk-grips','#chk-bounds','#chk-hero']) await page.locator(id).uncheck();
  for(const value of await page.locator('#sel-bg option').evaluateAll(options=>options.map(o=>o.value))) {
    await page.locator('#sel-bg').selectOption(value);
  }
  await page.screenshot({path:'tmp/pr12-sexton-preview.png',fullPage:true});

  assert.deepEqual(errors,[]);console.log('Desktop movement, gap jump, attack, reset, guides; mobile controls/layout: passed.');
} finally {await browser?.close();server.kill();}
