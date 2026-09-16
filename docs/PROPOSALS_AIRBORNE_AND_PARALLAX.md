# Airborne Motion, Parallax Skyline & Enemy Action Proposals

Status: Second round of asset proposals and technical atlas specifications submitted for owner review (PR).

## 1. Overview & Roadmap Alignment

This expansion resolves two critical pilot bottlenecks and delivers core M1/M2 roadmap milestones:
1. **Dedicated Jump & Air Motion (M2 / Pilot Gap)**:
   In [`docs/PILOT.md`](PILOT.md), the motion pilot noted:
   > *"Jumping temporarily reuses a passing pose... dedicated jump/fall/landing poses needed."*
   And in [`prototype/simulation.js`](../prototype/simulation.js):
   ```javascript
   if (!s.grounded) return 2; // Deliberate temporary pose until dedicated jump art exists.
   ```
   We introduce [`bellwarden-airborne-v001`](../art/production/bellwarden/bellwarden-airborne-v001.png) containing 3 dedicated airborne phases: ascent, apex tuck, and descent.

2. **Distant Skyline Parallax Layer (M1 Entrance Kit)**:
   Roadmap milestone M1 calls for:
   > *"- [ ] Separate sky and distant architecture."*
   And [`docs/PILOT.md`](PILOT.md) notes:
   > *"The backdrop still contains painted architecture and ground that are not collision surfaces."*
   We introduce [`skyline-distant-v001`](../art/production/abbey/skyline-distant-v001.png), a panoramic backdrop free of foreground ground geometry.

3. **Enemy Action Motion Sequence (M2 Character Pilot)**:
   Roadmap milestone M2 calls for:
   > *"- [ ] Produce one enemy idle/move/hit sequence."*
   We introduce [`hollow-pilgrim-motion-v001`](../art/production/enemies/hollow-pilgrim-motion-v001.png), a 4-pose action sheet (idle, shuffle stride, staff windup, downward strike) with companion atlas coordinates.

4. **Modular Vertical Architecture (M1 Entrance Kit)**:
   We introduce [`buttress-pillar-v001`](../art/production/abbey/buttress-pillar-v001.png), a modular limestone pillar and springing ribbed arch for room dividers and archways.

---

## 2. Asset Specifications & Generation Directives

### Asset 1: Bellwarden Airborne Motion Study (`bellwarden-airborne-v001`)
- **File**: [`art/production/bellwarden/bellwarden-airborne-v001.png`](../art/production/bellwarden/bellwarden-airborne-v001.png)
- **Atlas**: [`art/production/bellwarden/bellwarden-airborne-v001.json`](../art/production/bellwarden/bellwarden-airborne-v001.json)
- **Resolution**: 1376 × 768 px | **Format**: PNG (24-bit RGB) | **Status**: `prototype`
- **SHA-256**: `d7a35ba53c45ac8423743773b9f6f81ce8bb2a9de52b27583eb480bfe2a7de08`
- **In-Game Role**: Provides dedicated air state visual fidelity, replacing the reused walking passing pose.
- **Generation Prompt**:
  > *"Digital painting character animation study of 'The Bellwarden' protagonist for a 2D side-scrolling action platformer game. Side-on orthographic view, 2D platformer character poses arranged horizontally from left to right on a solid neutral dark background (#151822). Three distinct airborne jump phases: 1) Jump ascent / takeoff with knees bent and pale flowing mantle trailing upward, 2) Jump apex / tuck with body curled and mantle billowing, 3) Descending fall pose with sword pointed downward and feet angled down for landing. Consistent character proportions, athletic build, pale mantle (#B3AEA1), dark leather brigandine (#151822), moonlit slate highlights (#8292A6), one-handed straight sword. Clean silhouettes, no pixel art, no visible pixel grid, solemn Gothic dark fantasy matching Ashen Vesper art direction."*
- **Atlas Frame Coordinates**:
  - `jump-ascent`: `{ x: 50, y: 30, width: 400, height: 700, pivotX: 230, pivotY: 680 }`
  - `jump-apex`: `{ x: 480, y: 150, width: 420, height: 500, pivotX: 250, pivotY: 480 }`
  - `jump-descent`: `{ x: 920, y: 160, width: 380, height: 600, pivotX: 250, pivotY: 590 }`

---

### Asset 2: Distant Abbey Skyline Parallax Layer (`skyline-distant-v001`)
- **File**: [`art/production/abbey/skyline-distant-v001.png`](../art/production/abbey/skyline-distant-v001.png)
- **Resolution**: 1376 × 768 px | **Format**: PNG (24-bit RGB) | **Status**: `prototype`
- **SHA-256**: `d821eeb957e545c341ac0e58f089326db13e9b8d8fa07173106702ededc7b27c`
- **In-Game Role**: Independent parallax layer designed to scroll behind playable platforms at 0.15–0.30× camera velocity.
- **Generation Prompt**:
  > *"Digital painting of a distant background parallax layer for a 2D side-scrolling Gothic action platformer game. A wide horizontal panoramic vista of distant Gothic abbey spires, weathered bell towers, buttressed stone silhouettes, and jagged moonlit mountain ridges in the far distance against a deep indigo and midnight sky (#333D58, #151822). Cool moonlit rim highlights (#8292A6) along the rooftop ridges. Pure background scenery with atmospheric haze. Strictly NO foreground structures, NO characters, NO walkable ground or platforms, NO bottom baseline obstruction, so it can be layered as an independent parallax backdrop behind playable masonry. High definition digital painting, no pixel art, no visible pixel grid."*
- **Integration Note**: The bottom portion dissolves into deep indigo fog (`#151822`), preventing visual conflict with foreground causeway collision geometry.

---

### Asset 3: Hollow Pilgrim Motion Pilot Sheet (`hollow-pilgrim-motion-v001`)
- **File**: [`art/production/enemies/hollow-pilgrim-motion-v001.png`](../art/production/enemies/hollow-pilgrim-motion-v001.png)
- **Atlas**: [`art/production/enemies/hollow-pilgrim-motion-v001.json`](../art/production/enemies/hollow-pilgrim-motion-v001.json)
- **Resolution**: 1376 × 768 px | **Format**: PNG (24-bit RGB) | **Status**: `prototype`
- **SHA-256**: `ca6e9b9b9dc634e6576a44b32c6016ad193ed8eac378d942f2c554eef3f87db6`
- **In-Game Role**: Fulfills M2 enemy motion criteria. Four action poses mapped to a unified horizontal walking baseline.
- **Generation Prompt**:
  > *"Digital painting enemy animation study of 'The Hollow Pilgrim' for a 2D side-scrolling Gothic action platformer game. Side-on orthographic profile view, sequence of 4 key action poses arranged horizontally from left to right on a solid dark neutral background (#151822): 1) Idle stance holding the heavy iron bell-topped crozier staff upright, 2) Shuffling forward stride with trailing tattered vestments, 3) Heavy overhead staff windup anticipation, 4) Downward staff strike impact with the cracked bronze bell ringing. Consistent character proportions, emaciated frame in tattered indigo-slate cowl and cassock (#333D58, #8292A6), glowing amber eyes under the hood (#D99A52), weathered iron staff. Clean readable silhouettes with strong negative space, no pixel art, no visible pixel grid, solemn dark fantasy matching Ashen Vesper art direction."*
- **Atlas Frame Coordinates**:
  - `idle`: `{ x: 10, y: 140, width: 330, height: 620, pivotX: 190, pivotY: 600 }`
  - `shuffle`: `{ x: 360, y: 220, width: 370, height: 540, pivotX: 200, pivotY: 530 }`
  - `windup`: `{ x: 740, y: 80, width: 350, height: 680, pivotX: 190, pivotY: 670 }`
  - `strike`: `{ x: 1100, y: 260, width: 270, height: 500, pivotX: 180, pivotY: 490 }`

---

### Asset 4: Abbey Buttress Pillar & Arch Segment (`buttress-pillar-v001`)
- **File**: [`art/production/abbey/buttress-pillar-v001.png`](../art/production/abbey/buttress-pillar-v001.png)
- **Metadata**: [`art/production/abbey/buttress-pillar-v001.json`](../art/production/abbey/buttress-pillar-v001.json)
- **Resolution**: 896 × 1200 px | **Format**: PNG (24-bit RGB) | **Status**: `prototype`
- **SHA-256**: `2c7f0786effddf6cda5dedfa51a444748a23291ca4b9214841e1d339b05c4204`
- **In-Game Role**: Modular architectural column resting directly on masonry platforms, supporting room portals and overhead vaulted arches.
- **Generation Prompt**:
  > *"Digital painting of a modular Gothic architectural buttress pillar and arch segment for a 2D side-scrolling action platformer game. Side-on orthographic profile view. A tall vertical Gothic masonry pillar carved from weathered limestone (#B3AEA1) with deep mortar crevices (#151822) and cool moonlit slate highlights (#8292A6). Decorated with Gothic blind tracery lancets and subtle muted moss (#596453) at the base. At the top, the pillar springs into a ribbed arch segment. Clean flat base designed to rest on horizontal masonry platforms. Solid dark neutral background (#151822), high definition digital painting, no pixel art, no visible pixel grid, solemn dark fantasy matching Ashen Vesper art direction."*
- **Alignment Specs**:
  - Base width: 290 px
  - Springline Y: 400 px
  - Compatible with `masonry-module-v001` and `masonry-endcap-v001` baselines

---

## 3. Palette & Art Direction Audit

All assets conform to [`docs/ART_DIRECTION.md`](ART_DIRECTION.md):
- **Moonlit Slate** (`#8292A6`): Cool stone bevels, roof ridge highlights, and cowl contours.
- **Deep Shadow** (`#151822`): Background recesses, masonry joints, and under-hood shadows.
- **Distant Indigo** (`#333D58`): Sky gradient and distant mountain silhouettes.
- **Worn Limestone** (`#B3AEA1`): Pillar shaft, arch ribbing, and mantle highlights.
- **Lantern Amber** (`#D99A52`): Pilgrim eyes and distant abbey window accents.
- **Muted Moss** (`#596453`): Base masonry weathering.

---

## 4. Automated Verification Results

All suites executed with 100% success:

```bash
# Asset validator
npm run validate:assets
# -> 11 image dimensions/checksums, 15 atlas frames across 3 sheets, and 4 prop/module metadata files validated.

# Simulation unit tests
npm test
# -> 8 passing tests (elapsed-time movement, takeoff lock, gap jump, raised ledge, respawn, attack timing, facing lock, delay bound)

# Browser Playwright simulation
npm run test:browser
# -> Desktop movement, gap jump, attack, reset, guides; mobile controls/layout: passed.
```
