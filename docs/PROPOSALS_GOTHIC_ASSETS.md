# Gothic Asset Proposals — Interactive Props, Platform Modules & Enemy Silhouette

Status: Proposed assets and technical specifications submitted for owner review (PR).

## 1. Overview & Architectural Motivation

This proposal addresses core production milestones outlined in [ROADMAP.md](ROADMAP.md) and [PILOT.md](PILOT.md):
1. **M0 & M2 (Enemy Design)**: The project currently lacks an approved enemy design or enemy motion sheet, relying on a static brass practice ward.
2. **M1 (Environment Kit)**: The initial masonry module (`masonry-module-v001`) noted explicit limitations (*"no end caps or corners"*), leaving platform cutoffs raw.
3. **M1 & M3 (Interactive Props & Pickups)**: Classic action-platformers rely on destructible light sources (the candle archetype) to deliver pacing, spatial rhythm, and reward feedback.

Four original digital painted assets have been generated, cataloged in [`art/manifest.json`](../art/manifest.json), verified by [`tools/validate-assets.mjs`](../tools/validate-assets.mjs), and paired with structural JSON specifications.

---

## 2. Asset Specifications & Generation Directives

### Asset 1: Hanging Bell Brazier (`hanging-brazier-v001`)
- **File**: [`art/production/props/hanging-brazier-v001.png`](../art/production/props/hanging-brazier-v001.png)
- **Metadata**: [`art/production/props/hanging-brazier-v001.json`](../art/production/props/hanging-brazier-v001.json)
- **Dimensions**: 1024 × 1024 px (PNG, 24-bit RGB)
- **Status**: `prototype`
- **SHA-256**: `296f1202c400adb41964b38c3b9117e08d707fee66fe7aede80b1a38ce17cb4b`
- **Archetype & In-Game Role**: Interactive destructible prop suspended from arches and timber beams. Replaces the classic torch/candle trope with a Gothic wrought-iron bell censer. When struck by the Bellwarden's blade, it releases consecrated embers and sparks.
- **Generation Prompt**:
  > *"Digital painting of a Gothic wrought-iron hanging bell-censer brazier for a 2D side-scrolling action platformer game. Side-on orthographic elevation view. A heavy cast-iron bell-shaped censer suspended by weathered iron chains from the top. Intricate Gothic tracery cutouts in the iron body, with a warm ember glow (#D99A52) and tiny embers radiating from within. The iron surface shows cool moonlit slate highlights (#8292A6) and dark charcoal iron tones (#151822). Clean, crisp silhouette against a dark neutral background, no perspective tilt, high definition digital painting, no pixel art, no visible pixel grid, solemn dark fantasy atmosphere matching Ashen Vesper art direction."*
- **Atlas / Hitbox Specification**:
  - Display scale: 96 × 96 world units
  - Chain mount anchor: `[512, 32]`
  - Censer center: `[512, 620]`
  - Blade strike box: `{ x: 320, y: 420, width: 384, height: 480 }`
  - Particle emitter: `[512, 660]` (amber / ash embers)

---

### Asset 2: Consecration Ember Pickup (`consecration-ember-v001`)
- **File**: [`art/production/props/consecration-ember-v001.png`](../art/production/props/consecration-ember-v001.png)
- **Metadata**: [`art/production/props/consecration-ember-v001.json`](../art/production/props/consecration-ember-v001.json)
- **Dimensions**: 1024 × 1024 px (PNG, 24-bit RGB)
- **Status**: `prototype`
- **SHA-256**: `d948616e56fb4684f4c0cdea8d245f3b8c5be2a055fe9bbbbcc7b94acf50cdc4`
- **Archetype & In-Game Role**: Sanctified collectible and power currency dropped when bell-braziers are severed. A sacred bell-metal relic shard encased in consecrated amber flame.
- **Generation Prompt**:
  > *"Digital painting of an in-game collectible item for a 2D side-scrolling Gothic action platformer game: a 'Consecration Ember'. A floating sacred bell-metal relic shard encased in a radiant warm lantern-amber flame (#D99A52) with incandescent pale-gold core highlights (#FFF0BF) and delicate floating ash motes. The sacred metal fragment has carved Gothic liturgical grooves. Side-on game pickup icon, crisp readable silhouette against a solid dark slate background, high-definition digital painting, no pixel art, no visible pixel grid, mystical holy artifact."*
- **Atlas / Collision Specification**:
  - In-game display size: 40 × 40 world units
  - Pickup collection radius: 22 world units
  - Dynamic light emission: radius 72 world units, tint `#D99A52`

---

### Asset 3: Abbey Masonry End-Cap Module (`masonry-endcap-v001`)
- **File**: [`art/production/abbey/masonry-endcap-v001.png`](../art/production/abbey/masonry-endcap-v001.png)
- **Metadata**: [`art/production/abbey/masonry-endcap-v001.json`](../art/production/abbey/masonry-endcap-v001.json)
- **Dimensions**: 1200 × 896 px (PNG, 24-bit RGB)
- **Status**: `prototype`
- **SHA-256**: `d158dc8f70859c0505832308debb6f3d1add1d44c60ba520cdf3be47da41670d`
- **Archetype & In-Game Role**: Architectural edge terminal resolving the `masonry-module-v001` limitation. Caps platform ends, raised ledges, and broken causeway gaps with chiseled ashlar blocks and corbel overhang.
- **Generation Prompt**:
  > *"Digital painting of an architectural platform end-cap and corner piece for a 2D side-scrolling action platformer game. Side-on orthographic 2D profile view. A weathered Gothic abbey causeway edge and stone terminal. Top surface is a perfectly flat, clean horizontal walking ledge of worn limestone (#B3AEA1). The right edge terminates naturally with chiseled, weathered stone blocks, fractured masonry corner, and subtle muted moss (#596453) in the joints. The vertical face shows heavy ashlar stone masonry with deep shadow crevices (#151822) and cool moonlit slate highlights (#8292A6). Matches the style, perspective, and scale of masonry-module-v001.png. Clean neutral background, no 3D tilt, painted realism, no pixel art, no visible pixel grid."*
- **Alignment Specification**:
  - Walking cap height: 110 px from top surface
  - Overhang margin: 90 px corbel extension
  - Compatible with standard 240-unit modular causeway repeats

---

### Asset 4: The Hollow Pilgrim Enemy Concept (`hollow-pilgrim-concept-v001`)
- **File**: [`art/concepts/hollow-pilgrim-concept-v001.png`](../art/concepts/hollow-pilgrim-concept-v001.png)
- **Dimensions**: 896 × 1200 px (PNG, 24-bit RGB)
- **Status**: `concept`
- **SHA-256**: `12c197b36563d9e7a6331c8ef2f50dba53181b34b302a13377d868296e271f35`
- **Archetype & In-Game Role**: Primary candidate enemy fulfilling the M0 / M2 roadmap gate. An original Gothic interpretation of the relentless advancing undead wanderer: an emaciated penitent pilgrim in ragged indigo-slate cowl, dragging a heavy wrought-iron processional staff topped with a cracked bronze bell.
- **Generation Prompt**:
  > *"Digital painting character concept of 'The Hollow Pilgrim', a wandering Gothic penitent enemy for a 2D side-scrolling action platformer game. Side-on full body orthographic profile view, standing on a flat horizontal plane. An emaciated, hollow-eyed wandering pilgrim dressed in tattered monastic vestments and ragged cowl of dark indigo and moonlit slate (#333D58, #8292A6). Deep shadow under the cowl reveals faint glowing amber eyes (#D99A52). Leaning forward slightly, holding a heavy weathered wrought-iron processional staff topped with a cracked small bronze bell. Sharp, readable silhouette with distinct negative space between limbs and staff, perfect for 2D platformer collision and animation. Solid clean dark background (#151822), high-definition digital painting, no pixel art, no visible pixel grid."*
- **Readability & Silhouette Analysis**:
  - Distinct negative space between the iron staff, leaning torso, and trailing tattered vestments ensures unambiguous recognition against dark background geometry.
  - Amber eye points (`#D99A52`) match the Bellwarden's focal accent rules, providing an immediate read on facing direction and hostility.
  - Foot placement aligns to horizontal ground plane for clean 2D rigging or frame-by-frame mapping.

---

## 3. Palette & Art Direction Compliance

All four assets were audited against the tonal values and material rules established in [`ART_DIRECTION.md`](ART_DIRECTION.md):

| Target Swatch | Hex Code | Role | Usage in New Assets |
|---|---|---|---|
| **Deep Shadow** | `#151822` | Background voids & crevices | Mortar seams, cowl hollows, dark metal shadows |
| **Distant Indigo** | `#333D58` | Atmospheric depth & fabric | Pilgrim tattered vestment undertones |
| **Moonlit Slate** | `#8292A6` | Cool highlights & atmosphere | Iron chain highlights, pilgrim cowl folds, stone edge bevel |
| **Worn Limestone** | `#B3AEA1` | Walkable surfaces | End-cap horizontal ledge surface |
| **Lantern Amber** | `#D99A52` | Sparse focal accents | Brazier interior glow, holy ember fire, pilgrim eyes |
| **Muted Moss** | `#596453` | Environmental variation | End-cap stone seam vegetation |

- **No Pixel Art**: 100% painted digital fidelity; no visible pixel grids or simulated dithering.
- **Orthographic Alignment**: Pure side-on elevations with zero camera skew, preserving horizontal gameplay collision invariants.

---

## 4. Verification & Automated Quality Checks

The following automated suites were executed to verify complete repository integrity:

```bash
# 1. Verification of dimensions, sha256 checksums, and metadata bounds
npm run validate:assets
# Output: 7 image dimensions/checksums, 8 atlas frames, and 3 prop/module metadata files validated.

# 2. Physics & simulation unit test suite
npm test
# Output: 8 passing tests (elapsed time, takeoff lock, gap jump, raised ledge, respawn, attack timing, facing lock, delay bound)

# 3. Headless Chromium browser integration check (desktop & mobile touch)
npm run test:browser
# Output: Desktop movement, gap jump, attack, reset, guides; mobile controls/layout: passed.
```

---

## 5. Review Notes & Recommendations for Owner

As the primary driver and creative owner, the following decisions are open for your direction:
1. **The Hollow Pilgrim Motion Sheet**: If this concept is approved for M2, we can proceed to decompose the silhouette into a 4-pose shuffle walk, heavy staff windup/strike, and dissolving ash recoil.
2. **End-Cap Directionality**: `masonry-endcap-v001` represents a right-side terminal. We can provide a horizontal mirror or a dedicated asymmetrical left-side ruined buttress module.
3. **Alpha Pipeline**: Source PNGs are currently opaque RGB to preserve lossless source fidelity. We can supply pre-keyed alpha PNGs or follow the Bellwarden magenta-key convention.
