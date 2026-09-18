# World 06: Bell Tower — Timber Landing Platform Module (v001)

## Overview & Purpose
This contribution delivers the foundational **Bell Tower Timber Landing Platform Module** (`tower-landing-v001.png`), specified in `docs/art-jobs/10-bell-tower.md` ("First production assets: landing 1024 × 256 RGBA / runtime 240 × 60 / top y=32") and `docs/world/stages/06-bell-tower.md` ("First bounded art PR: one tower landing with top-surface and underside bounds").

It establishes the walkable ascending resting platforms and gallery landings required for the vertical ascent sequence across the 5 rooms of the Bell Tower (`06-A` through `06-E`), connecting the lower arrival zone to the upper bell chamber and Tolling Boss arena.

## Technical Specifications
- **Source Image**: `art/contributions/world-06-bell-tower/v001/source/tower-landing-generated-v001.jpg`
  - Dimensions: 1376 × 768 JPEG
  - SHA-256: `783288d82f222df1a939080252f5cdc27be44e4c564098d3ba497f3e7e3f7d1d`
  - Bytes: 255,876
- **Export Cutout**: `art/contributions/world-06-bell-tower/v001/exports/tower-landing-v001.png`
  - Dimensions: 1024 × 256 RGBA PNG (Color Type 6, 8-bit depth)
  - SHA-256: `9e9058c0762bef779e75e6899893cfd1ac3a0ed7c73048a36010e5c07397bd45`
  - Bytes: 211,811
- **Review Composite**: `docs/reviews/tower-landing-v001.png`
  - Dimensions: 1440 × 1040 PNG
  - SHA-256: `ee7874e43f383eec1d4d248ad33d4cf9cf17b7de478c4035092cd353b8649d3a`
  - Bytes: 361,048

## Geometry & Contract Alignment
- **Canvas & Scaling**:
  - Source canvas: 1024 × 256 RGBA.
  - Nominal runtime canvas: 240 × 60 at uniform scale `240 / 1024` (~0.234375), conforming to `docs/art-jobs/10-bell-tower.md`.
- **Top Walking Surface**:
  - Painted top surface: level contact surface strictly at source `y = 32` (`y = 7.5` runtime).
  - Less than 1px vertical deviation across the entire 600px central span.
- **Measured Silhouette Bounds**:
  - `minX = 56`, `maxX = 967` (width 912px = 213.75 runtime units).
  - `minY = 30`, `maxY = 211` (height 182px = 42.66 runtime units).
- **Sockets & Horizontal/Vertical Mounting**:
  - Left contact socket: `(56, 32)` source -> `(13.1, 7.5)` runtime.
  - Right contact socket: `(968, 32)` source -> `(226.9, 7.5)` runtime.
  - Underside limestone corbel brackets: provide solid architectural footing against vertical tower masonry walls.
- **Clearance & Safe Margins**:
  - Left margin: 56px (≥ 16px safe clearance).
  - Right margin: 56px (≥ 16px safe clearance).
  - Top margin: 30px (≥ 16px safe clearance).
  - Bottom margin: 44px (≥ 16px safe clearance).
  - Border violations: 0 in all outer margins.

## Material & Aesthetic Harmony
- **Timber & Masonry Construction**:
  - Heavy weathered dark oak timbers with visible end-grain and mortise joints.
  - Carved pale limestone corbel brackets anchoring the structure beneath the timber span.
  - Forged dark wrought-iron straps with raised bolt heads reinforcing the beams.
- **Color Palette**:
  - Muted gray-brown aged timber (`#3a3328` to `#5c5342`).
  - Cold limestone corbels (`#7e8580` to `#a2a89d`) harmonizing with Stage 01 Abbey limestone and Stage 02 Ruined Cloister piers.
  - Deep oxidized iron hardware (`#222428`).

## Status & Integration Notes
- Candidate status: ready for baseline layout review and future integration into vertical shaft climbing sequences once vertical camera and moving platform systems are integrated.
