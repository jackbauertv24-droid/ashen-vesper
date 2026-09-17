# Job 12 — Iron Sexton Heavy Enemy (v001)

- Asset: Original Gothic Iron Sexton heavy enemy design reference for Ashen Vesper.
- Generator tool: DeepMind Agent Image Generation (`imagen-3.0-generate-002`).
- Generation attempts: 1 attempt generated and recorded.
- Original generator output: `source/iron-sexton-generated-v001.png` (1024 × 1024 PNG, SHA-256: `5472234b382e886f356fa856c0873dcf43397b072d4ab51d0a08d61a5ad020f0`).
- Export deliverable: `exports/iron-sexton-v001.png` (1024 × 1024 RGBA PNG, color type 6, SHA-256: `6160870a5e7ee90ce74a9ef889d2301991abefd726bc1091dcc4e0a85f801fb4`).
- Visual review evidence: `docs/reviews/iron-sexton-v001.png` (1400 × 950 PNG, SHA-256: `cfa5787bc13e4927489201eec33793b5fd6703e8fb36a935b5c47e59d902299b`).
- Quota / Cost: Standard AI Agent generation quota; exact monetary cost unknown.

## Design and Style Alignment
- Subject: Imposing, broad hunched abbey caretaker wearing a battered dark iron half-mask with vertical viewing slits, riveted iron apron breastplates, and torn muted-indigo work smock with stitched repairs.
- Weapon: Heavy, long-handled iron grave shovel with a broad chipped cutting blade gripped securely in two gloved hands.
- Materials: Weathered dark iron matching the abbey portcullis gate; worn limestone dust and mud on boots; indigo cloth harmonizing with the Bellwarden cape accents.
- Proportions & Stance: Grounded heavy stance facing right; silhouette reads with unmistakable weight, distinguishing the Sexton immediately from the taller, leaner Hollow Pilgrim.

## Technical Contract Verification
- Dimensions: 1024 × 1024, PNG Color Type 6 (True RGBA).
- Outer 32px perimeter alpha: Exactly 0 across all 126,976 perimeter pixels (0 violations).
- Measured visible bounds: `minX=148, maxX=973, minY=76, maxY=973` (826 × 898 px).
  - Left margin: 148px (> 32px requirement).
  - Top margin: 76px (> 32px requirement).
  - Right margin: 50px (> 32px requirement).
  - Bottom margin: 50px (> 32px requirement).
- Standing Character Height: 898 px (hood peak `y=76` to boot tread `y=973`).
- Runtime Scale: Target 160 units height (compared to Bellwarden hero 144 units).
  - Reference canvas scale factor: `160 / 898 = 0.1782`.
  - Future 512 × 512 motion cells will draw standing height at 400px (scale `0.4`), placing ground pivot at `(208, 464)`.
- Weapon Geometry:
  - Shovel length in 2D projection: ~868 px.
  - Rear hand grip: `(380, 560)`.
  - Forward hand grip: `(680, 480)`.
  - Cutting blade tip: `(973, 388)`.
  - Staff butt: `(148, 660)`.

## Export Methodology
1. Generator output produced isolated figure on pure solid black background with generous margins.
2. Background identified using 4-edge connected flood-fill (`max(R,G,B) <= 14`).
3. Anti-aliasing applied strictly to exterior perimeter boundary pixels to eliminate fringing, preserving all dark interior folds, iron crevices, and shadows at 100% opacity.
4. Outer 32px perimeter strictly clamped to alpha 0.

## Acceptance & Engine Status
- Status: `candidate`
- Purpose: Prototype design reference candidate establishing character model, materials, and weapon geometry.
- Per brief guidelines (*"For a multi-stage enemy or boss, start with a design reference; only produce motion once that reference is recorded as the selected prototype direction"*), eight-pose motion sheet and combat AI implementation are deferred until maintainer review of this design direction.
