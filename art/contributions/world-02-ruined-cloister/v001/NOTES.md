# World 02: Ruined Cloister — Walkable Platform / Landing Cap Module (v001)

## Overview & Purpose
This contribution delivers the foundational **Ruined Cloister Walkable Platform / Landing Cap Module** (`platform-cap-v001.png`), specified in `docs/world/README.md` (Exact shared asset defaults, line 84) and `docs/world/stages/02-ruined-cloister.md` (Asset Queue). It completes the architectural trifecta alongside the Ruined Cloister Arch Span and Arcade Pier (Job 08 / PR #19), enabling the construction of walkable upper gallery walkways, cloister balconies, bridges, and floor slabs across Stage 02's six rooms.

## Technical Specifications
- **Source Image**: `art/contributions/world-02-ruined-cloister/v001/source/platform-cap-generated-v001.jpg`
  - Dimensions: 1376 × 768
  - SHA-256: `d098ddb507835ee2a616ad61338b66ce73b1e00a09409e409084059577ff7291`
  - Bytes: 405,633
- **Export Cutout**: `art/contributions/world-02-ruined-cloister/v001/exports/platform-cap-v001.png`
  - Dimensions: 1024 × 256 RGBA PNG (Color Type 6, 8-bit depth)
  - SHA-256: `61628b86a94b85b0b775883d6e5b45479774856c0a0add2fff5a94f9d1c401bc`
  - Bytes: 328,178
- **Review Composite**: `docs/reviews/cloister-platform-cap-v001.png`
  - Dimensions: 1440 × 1040 PNG
  - SHA-256: `da74f0e7dfa7b01c7dd52ee2afecb87ad2ada2d169dd7384fd25c3f733e656a6`
  - Bytes: 554,274

## Geometry & Contract Alignment
- **Canvas & Scaling**:
  - Source canvas: 1024 × 256 RGBA.
  - Nominal runtime canvas: 240 × 60 at uniform scale `240 / 1024` (~0.234375), conforming to `docs/world/README.md` line 84.
- **Top Walking Surface**:
  - Painted top surface: strictly at source `y = 32` (`y = 7.5` runtime).
  - Less than 1px horizontal deviation across the main 800px walking span.
- **Measured Silhouette Bounds**:
  - `minX = 64`, `maxX = 959` (width 896px = 210 runtime units).
  - `minY = 32`, `maxY = 214` (height 183px = 42.9 runtime units).
- **Sockets & Horizontal Tiling**:
  - Left contact socket: `(64, 32)` source -> `(15, 7.5)` runtime.
  - Right contact socket: `(960, 32)` source -> `(225, 7.5)` runtime.
  - Repeat interval: `960 - 64 = 896` source pixels (210 runtime units at 240/1024 scale, or 224 units at 0.25 scale).
  - When chained consecutively at 896px intervals, right socket `(960, 32)` of cap N touches left socket `(64, 32)` of cap N+1 flush with zero gap and zero double-opacity overlap.
- **Clearance & Safe Margins**:
  - Left margin: 64px (≥ 32px safe clearance).
  - Right margin: 64px (≥ 32px safe clearance).
  - Top margin: 32px (≥ 16px safe clearance).
  - Bottom margin: 41px (≥ 32px safe clearance).
  - Border violations: 0 in all outer margins.
- **Colonnade Integration with Job 08 Arcade Kit**:
  - The 896px span between sockets exactly matches the 896px pier socket distance of the Ruined Cloister Arch Span (`x=64` to `x=960`).
  - The decorative corbel profile at the ends of the cap rests naturally above the pier capitals (`y=44` top impost), forming a complete arcade with an upper balcony walkway.

## Generation & Extraction Process
1. **Generation Tool**: Google Imagen 3 via Antigravity `generate_image`.
2. **Keying & Processing**:
   - Perceptual luma keying on pure solid black background `#000000` with smoothstep transition `(threshold=18, feather=14)`.
   - Scaled and centered to 1024 × 256 canvas preserving aspect ratio, with painted top placed at `y = 32` and span anchored at `x = 64..959`.
3. **Verification**:
   - Contrast checks across Pure White (`#ffffff`), Pure Black (`#000000`), Abbey Cold Indigo (`#141624`), and Grayscale tonal balance.
   - Three-copy continuous run verified with Bellwarden hero standing at nominal height 144 units (120 collision).
   - Full colonnade assembly verified combining Piers, Arches, and Platform Caps.

## Known Limitations & Integration Notes
- This module is an architectural visual asset, not collision code. Walkable solid surfaces and one-way platform logic are bound by the stage collision system.
- For short single-bay spans or corners, end-cap variants or terminal brackets may be added in future iterations.
