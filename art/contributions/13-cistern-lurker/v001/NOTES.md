# Job 13 — Cistern Lurker Low Ambush Enemy (v001)

- Asset: Original Gothic Cistern Lurker low ambush enemy design reference for Ashen Vesper.
- Generator tool: DeepMind Agent Image Generation (`imagen-3.0-generate-002`).
- Generation attempts: 1 attempt generated and recorded.
- Original generator output: `source/cistern-lurker-generated-v001.png` (1024 × 1024 PNG, SHA-256: `5e6640b7c348eb380b9dcbde3c403a19ae66972f57b075d4a37a397635ab662e`).
- Export deliverable: `exports/cistern-lurker-v001.png` (1024 × 1024 RGBA PNG, color type 6, SHA-256: `471b345fb3b3a4ffcaa9ace62e641f2f9c182b624cf4e6693126088263c46e5c`).
- Visual review evidence: `docs/reviews/cistern-lurker-v001.png` (1400 × 950 PNG, SHA-256: `b72e5f543e332dcace6e72307b4213f5e368225fbd97d165855441a421478264`).
- Quota / Cost: Standard AI Agent generation quota; exact monetary cost unknown.

## Design and Style Alignment
- Subject: Low creeping quadrupedal construct formed of weathered cistern slate blocks and twisting dark roots intertwined around an ancient iron reliquary.
- Weak Point / Core: Restrained warm amber soul core glowing gently behind a rusted iron vertical-bar cage/grille at the forward chest/head.
- Threat Spacing: Low crouch-height threat profile (aspect ratio ~1.86 : 1), offering a direct target for low sword attacks and crouch thrusts without requiring floor-sinking tricks.
- Materials: Weathered damp blue-gray slate matching cistern masonry, dark damp roots and moss lichen harmonizing with abbey foliage.

## Technical Contract Verification
- Dimensions: 1024 × 1024, PNG Color Type 6 (True RGBA).
- Outer 32px perimeter alpha: Exactly 0 across all 126,976 perimeter pixels (0 violations).
- Measured visible bounds: `minX=43, maxX=984, minY=267, maxY=772` (942 × 506 px).
  - Left margin: 43px (> 32px requirement).
  - Right margin: 39px (> 32px requirement).
  - Top margin: 267px (> 32px requirement).
  - Bottom margin: 251px (> 32px requirement).
- Ground Pivot: Declared `(512, 772)` aligning with the lowest clawed foot contact.
- Runtime Scale: Brief target `96 × 48` units (scale `~0.1019` on 1024 reference canvas). Future motion sheet (512 cells) nominal silhouette `320 × 160` at scale `0.3`.
- Core Geometry: Reliquary amber core center located at `(730, 440)`, precisely aligning with Bellwarden's crouched low sword reach.

## Export Methodology
1. Generator output produced isolated creature on pure solid black background with generous margins.
2. Background identified using 4-edge connected flood-fill (`max(R,G,B) <= 14`).
3. Trapped negative space pocket between hind legs and underbelly cleared with connected flood-fill.
4. Reliquary interior and stone body crevices fully preserved at 100% opacity.
5. Anti-aliasing applied to perimeter boundary pixels to eliminate fringing.
6. Outer 32px perimeter strictly clamped to alpha 0.

## Acceptance & Engine Status
- Status: `candidate`
- Purpose: Prototype design reference candidate establishing anatomy, proportions, reliquary core target, and materials.
- Six-pose motion sequence (rest, emerge, crawl A/B, lunge, recover) and Flooded Cistern ambush spawn logic will follow maintainer direction.
