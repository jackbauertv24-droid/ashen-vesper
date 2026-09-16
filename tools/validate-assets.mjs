import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
const manifest=JSON.parse(fs.readFileSync('art/manifest.json'));
for(const a of manifest.assets){const bytes=fs.readFileSync(a.path),png=PNG.sync.read(bytes);assert.equal(png.width,a.width);assert.equal(png.height,a.height);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);}
const atlas=JSON.parse(fs.readFileSync('art/production/bellwarden/bellwarden-pilot-v001.json'));
const png=PNG.sync.read(fs.readFileSync('art/production/bellwarden/bellwarden-pilot-v001.png'));
assert.equal(atlas.frames.length,8);
for(const f of atlas.frames){assert.ok(f.x>=0&&f.y>=0&&f.x+f.width<=png.width&&f.y+f.height<=png.height,f.name);assert.ok(f.pivotX>=0&&f.pivotX<=f.width&&f.pivotY>=0&&f.pivotY<=f.height,f.name);}
assert.equal(atlas.transparency,'magenta-key');assert.ok(png.data[0]>230&&png.data[1]<25&&png.data[2]>230);
const brazierMeta = JSON.parse(fs.readFileSync('art/production/props/hanging-brazier-v001.json'));
assert.ok(brazierMeta.strikeBox.x + brazierMeta.strikeBox.width <= brazierMeta.nativeSize.width);
const emberMeta = JSON.parse(fs.readFileSync('art/production/props/consecration-ember-v001.json'));
assert.ok(emberMeta.pickupRadius > 0 && emberMeta.lightRadius > emberMeta.pickupRadius);
const endcapMeta = JSON.parse(fs.readFileSync('art/production/abbey/masonry-endcap-v001.json'));
assert.ok(endcapMeta.capHeight > 0 && endcapMeta.walkableBaselineY > 0);
console.log(`${manifest.assets.length} image dimensions/checksums, 8 atlas frames, and 3 prop/module metadata files validated.`);

