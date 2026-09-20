# Job 09 — Flooded Cistern Vault Pier Candidate (v001)

## Submission Overview
- **Job ID**: `09-flooded-cistern`
- **Stage**: World 03: Flooded Cistern
- **Status**: `candidate`
- **Purpose**: Vertical architectural masonry support column providing vault ceiling spring-line elevation and ambient amber illumination above the subterranean water reservoirs.
- **Specification Source**: `docs/art-jobs/09-flooded-cistern.md` and `docs/world/stages/03-flooded-cistern.md`.

## Technical Specifications
- **Raw Generator Source**: `art/contributions/09-flooded-cistern/v001/source/cistern-vault-pier-generated-v001.jpg`
  - Dimensions: 1024 × 1024 JPEG
  - SHA-256: `73e71eb6da10988d13cef0bd80f5a51eeba7b6ea61bac6bfe1c3e432c5f58576`
  - Size: 357,311 bytes
- **Export Cutout**: `art/contributions/09-flooded-cistern/v001/exports/cistern-vault-pier-v001.png`
  - Dimensions: 1024 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha channel)
  - SHA-256: `2220f6403089ee3e58d7e54abbbb1a65da1365bd285ea97ba4680d2784d3991a`
  - Size: 615,105 bytes
- **Review Composite**: `docs/reviews/cistern-vault-pier-v001.png`
  - Dimensions: 1440 × 1040 PNG
  - SHA-256: `cfd909a6e1d729fe3cb1e0e336ef8aa79abca775002ff2a59fa7d968831269f6`
  - Size: 523,198 bytes

## Geometry, Bounds & Margins
- **Visible Bounds**:
  - Horizontal: $x = 270..752$ (width: 483 px)
  - Vertical: $y = 43..979$ (height: 937 px)
- **Clear Padding / Margin Safety**:
  - Left: 270 px
  - Right: 271 px (exact horizontal balance, centered around $x = 511.5$)
  - Top: 43 px ($> 32$ px)
  - Bottom: 44 px ($> 32$ px)
  - Border violations: **0** (strictly clears the 32 px boundary contract)
- **Anchoring & Pivot**:
  - Ground Pivot: Source `[512, 960]` (at the base plinth footing, matching Job 08 cloister pier)
  - Runtime Pivot: `[120, 225]`
  - Runtime Canvas: $240 	imes 240$ world units (`scale = 240 / 1024 = 0.234375`)
- **Transparency & Pierced Openings**:
  - Outer background: Pure RGBA transparency ($A = 0$)
  - Stone shaft core: 100% solid opacity ($A = 255$ at shaft center $(512, 600)$, capital $(512, 300)$, and base $(512, 900)$)
  - Bracket aperture: Genuine interior pierced transparency within the forged iron bracket curl ($2,510$ transparent interior pixels in the bracket aperture zone)

## Visual Design & Parity
- **Materiality**: Weathered dark slate and damp limestone blocks with wet mossy seepage and dark moisture stains, matching Flooded Cistern environmental tone.
- **Accents**: Oxidized wrought iron banding collar around the pier shaft; antique forged iron cantilever bracket holding an ambient warm amber oil lantern.
- **Pairing**: Aligns with World 03 damp platform caps (`art/contributions/world-03-flooded-cistern/`) and Cistern Lurker encounter (`art/contributions/13-cistern-lurker/`).
