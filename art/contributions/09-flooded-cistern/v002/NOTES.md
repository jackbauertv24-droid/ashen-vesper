# Job 09 — Flooded Cistern Unlit Vault Pier & Separate Hanging Lantern Candidate (v002)

## Submission Overview
- **Job ID**: `09-flooded-cistern`
- **Stage**: World 03: Flooded Cistern
- **Version**: `v002`
- **Status**: `candidate`
- **Maintainer Review Resolution**: Directly resolves PR 28 maintainer review (`docs/PR_22_28_REVIEW.md`):
  > "The attached lantern makes repeated piers visually identical and may duplicate lights; provide an unlit pier derivative and separate lantern before kit assembly."
- **Delivered Assets**:
  1. `exports/cistern-vault-pier-unlit-v002.png`: Clean unlit vertical masonry vault pier without baked light or lantern bracket, enabling continuous multi-column colonnades without duplicated light fixtures.
  2. `exports/cistern-hanging-lantern-v002.png`: Independent hanging iron lantern prop with vertical chain ceiling suspension and glowing amber glass flame, modularly attachable to ceilings, vaults, or pier collars as needed.

## Technical Specifications

### 1. Unlit Vault Pier (`cistern-vault-pier-unlit-v002`)
- **Raw Generator Source**: `art/contributions/09-flooded-cistern/v002/source/cistern-vault-pier-unlit-generated-v002.jpg`
  - Dimensions: 1024 × 1024 JPEG
  - SHA-256: `8cef607a3d4a1896e4c21a7702c18143eb7271528250ab18799799822d68b206`
- **Export Cutout**: `art/contributions/09-flooded-cistern/v002/exports/cistern-vault-pier-unlit-v002.png`
  - Dimensions: 1024 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha)
  - SHA-256: `734f892f7256f1e7c512e0be18fc25c58739e822d2b67ad905edf1edf5fc96b5`
- **Visible Bounds & Margins**:
  - Horizontal: $x = 114..909$ (width: 796 px, centered at $x = 511.5$)
  - Vertical: $y = 36..987$ (height: 952 px)
  - Clear Margins: Left 114 px, Right 114 px, Top 36 px, Bottom 36 px (all $\ge 32$ px border clearance)
  - Shaft Span: $x = 352..671$ (width 320 px, centered at $x = 512$)
  - Sockets: Top contact $y = 36$, Spring capital $y = 192$ (span $114..909$), Ground pivot $[512, 987]$

### 2. Hanging Lantern (`cistern-hanging-lantern-v002`)
- **Raw Generator Source**: `art/contributions/09-flooded-cistern/v002/source/cistern-hanging-lantern-generated-v002.jpg`
  - Dimensions: 1024 × 1024 JPEG
  - SHA-256: `2144b150ac8da1cba4655a7b77bafce2ef1e31b83d519c794f9a76d1644968d0`
- **Export Cutout**: `art/contributions/09-flooded-cistern/v002/exports/cistern-hanging-lantern-v002.png`
  - Dimensions: 1024 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha)
  - SHA-256: `736587817c93d14cbbf74e2a62987a4b5e0f513fdd90029da1ac3c418edcd917`
- **Visible Bounds & Margins**:
  - Horizontal: $x = 275..750$ (width: 476 px, centered at $x = 512.5$)
  - Vertical: $y = 32..991$ (height: 960 px)
  - Clear Margins: Left 275 px, Right 273 px, Top 32 px, Bottom 32 px (all $\ge 32$ px border clearance)
  - Suspension: Top chain link at $[512, 32]$, glowing amber flame core at $[512, 512]$, finial spike at $[512, 991]$
  - Transparency: Pierced genuine chain opening transparency ($> 40,000$ transparent interior pixels in suspension loop area)

## Review Composite
- **Review Composite**: `docs/reviews/cistern-vault-pier-unlit-v002.png`
  - Dimensions: 1680 × 1260 PNG
  - Demonstrates:
    1. Isolated unlit pier with socket overlays and visible bounds.
    2. Isolated hanging lantern prop with ceiling suspension and light center.
    3. Multi-column colonnade showing unlit rhythm with optional sparse lantern placement (resolving duplicate lighting).
    4. Runtime scale scene overlay with Bellwarden scale reference.
