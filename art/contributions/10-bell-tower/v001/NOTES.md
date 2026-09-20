# Job 10: Bell Tower — Great Bronze Bell Module (v001)

## Overview & Purpose
This contribution delivers the foundational **Great Bronze Bell Module** (`bronze-bell-v001.png`), specified in `docs/art-jobs/10-bell-tower.md` ("First production assets: ... bell later 1024 × 1024 RGBA / runtime 160 × 160 / hanging pivot (512,64)") and `docs/world/stages/06-bell-tower.md` (Asset queue: "bronze bell").

It forms the central thematic and visual landmark of the Bell Tower stage, designed to hang from the upper belfry timber framework or support arch above the Stage 06 Tollkeeper arena.

## Technical Specifications
- **Source Image**: `art/contributions/10-bell-tower/v001/source/bronze-bell-generated-v001.jpg`
  - Dimensions: 1024 × 1024 JPEG
  - SHA-256: `fdf0cb72ae72388de93c627bb77c651d63b4db0965911a32235d1119cdf20b19`
  - Bytes: 334,166
- **Export Cutout**: `art/contributions/10-bell-tower/v001/exports/bronze-bell-v001.png`
  - Dimensions: 1024 × 1024 RGBA PNG (Color Type 6, 8-bit depth)
  - SHA-256: `85fbe43081604d4e1401cc5c9a5d3f508b0a779137237fe33a83a9e482c83b29`
  - Bytes: 673,313
- **Review Composite**: `docs/reviews/bell-tower-bronze-bell-v001.png`
  - Dimensions: 1440 × 1040 PNG
  - SHA-256: `221e64a250311621677b64904212eabe2b9721bc7a2772518b1c94e481827791`
  - Bytes: 636,193

## Geometry & Contract Alignment
- **Canvas & Scaling**:
  - Source canvas: 1024 × 1024 RGBA.
  - Runtime footprint: 160 × 160 canvas at uniform scale `160 / 1024` (~0.15625), conforming to `docs/art-jobs/10-bell-tower.md`.
- **Hanging Pivot**:
  - Hanging pivot: `(512, 64)` source -> `(80, 10)` runtime.
  - Top apex of canon suspension loop begins at `y = 64`, resting flush on overhead support beams.
- **Measured Silhouette Bounds**:
  - `minX = 165`, `maxX = 858` (width 694px = 108.4 runtime units).
  - `minY = 64`, `maxY = 924` (height 861px = 134.5 runtime units).
- **Clearance & Safe Margins**:
  - Left margin: 165px (≥ 16px safe clearance).
  - Right margin: 165px (≥ 16px safe clearance).
  - Top margin: 64px (≥ 16px safe clearance).
  - Bottom margin: 99px (≥ 16px safe clearance).
  - Border violations: 0 across all 4 outer margins.

## Material & Aesthetic Harmony
- **Cast Bronze & Wrought Iron**:
  - Ancient weathered bronze with authentic greenish verdigris patina.
  - Gothic pointed blind arcade tracery and filigree bands encircling the waist.
  - Cast-iron suspension canon loop with pierced transparent eyelet.
  - Dark cast iron clapper ball extending beneath the sound bow rim.
- **Layer & Mechanics Purpose**:
  - Centerpiece visual asset for upper belfry room.
  - Separation: bell, support timbers, and counterweights remain independent modular assets per Job 10 contract.

## Status & Integration Notes
- Candidate status: ready for baseline layout review and future belfry rigging integration once vertical camera and Tollkeeper arena are assembled.
