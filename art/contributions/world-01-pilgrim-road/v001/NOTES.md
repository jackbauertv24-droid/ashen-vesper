# World 01: Pilgrim Road — Abbey Limestone Stair Flight Module (v001)

## Overview & Purpose
This contribution delivers the foundational **Abbey Limestone Stair Flight Module** (`stair-flight-v001.png`), specified in `docs/world/examples/v001/01-pilgrim-road-INSTRUCTIONS.md` (Item 3, Stair Kit). It provides the primary visual traversal module connecting multi-elevation floor bands and vertical room transitions across the 95 stair control guides defined in the Stage 01–06 baseline world layouts.

## Technical Specifications
- **Source Image**: `art/contributions/world-01-pilgrim-road/v001/source/stair-flight-generated-v001.jpg`
  - Dimensions: 1024 × 1024
  - SHA-256: `8d7d53806f21d4d62e21685bc24bccf37ab710e68ce8cb41cb9eaa4f62023a7a`
- **Export Cutout**: `art/contributions/world-01-pilgrim-road/v001/exports/stair-flight-v001.png`
  - Dimensions: 1024 × 1024 RGBA PNG (Color Type 6, 8-bit depth)
  - SHA-256: `453180ef8fdf91c1daed14dcee7cc208272a79579975f76317d2f195ed507ccb`
- **Review Composite**: `docs/reviews/stair-flight-v001.png`
  - Dimensions: 1440 × 1040 PNG
  - SHA-256: `91e6d02560c8279eb8d99145190fd4b078dd7986a3dfc079aecf3df291a2f9d6`

## Geometry & Contract Alignment
- **Runtime Scale**: `0.25` (nominal 256 × 256 world canvas).
- **Horizontal Run**:
  - Source bounds: `x = 64` to `x = 959` (896 pixels).
  - Runtime run: `896 * 0.25 = 224 world units`.
  - Exactly conforms to `docs/world/examples/v001/01-pilgrim-road-INSTRUCTIONS.md`: "nominal socket rise/run 224".
- **Vertical Rise**:
  - Bottom footing ground socket: `(64, 960)` source -> `(16, 240)` runtime.
  - Top landing nosing socket: `(960, 394)` source -> `(240, 98.5)` runtime.
  - Step tread vertical rise: `899 - 394 = 505 pixels = 126.25 world units` (approx. 4 cells of 32 grid units = 128 units).
- **Step Architecture**:
  - 11 distinct carved limestone treads with moulded stone nosings (~90px wide treads, ~55px risers).
  - Flat bottom landing block resting solid on ground plane at `y = 960`.
  - Solid closed ashlar stone stringer underneath supporting the steps down to the ground plane.
- **Clearance & Safe Margins**:
  - Left margin: 64px (≥ 32px required safe clearance).
  - Right margin: 64px (≥ 32px required safe clearance).
  - Top margin: 394px (≥ 32px required safe clearance).
  - Bottom margin: 64px (≥ 32px required safe clearance).
  - Zero perimeter boundary bleed or edge clipping.

## Dual Facing & Modular Stacking
- **Native Facing (`ascend-right`)**: Ascends from bottom-left `(64, 960)` to top-right `(960, 394)`.
- **Flipped Facing (`ascend-left`)**: Mirrored via `transform: scaleX(-1)` ascending from bottom-right `(960, 960)` to top-left `(64, 394)`.
- **Multi-Flight Stacking**: Consecutive stair flights join cleanly with a 32-unit landing cap or directly at socket boundaries.

## Generation & Extraction Process
1. **Generation Tool**: Google Imagen 3 (via Antigravity `generate_image`).
2. **Keying & Processing**:
   - Alpha extraction using perceptual luma keying with smooth step transition `(threshold=18, feather=14)`.
   - Bounded flood fill to ensure zero matte leakage in hollows.
   - Exact geometry alignment placing bottom footing at `y = 960` and horizontal run span `x = 64..960` (896px = 224 units).
3. **Verification**:
   - Contrast checks across Pure White (`#ffffff`), Pure Black (`#000000`), Abbey Indigo (`#141624`), and Grayscale value modes.
   - Verification of 100% solid opacity across treads and risers.
   - Telemetry socket overlay and hero scale alignment (nominal standing height 144 units).

## Known Limitations & Integration Notes
- This module is an architectural visual asset, not collision code. The world runner / collision engine implements slope traversal via the 95 stair guides declared in the baseline JSONs.
- For steeper or shallower transitions in specific rooms, modular landings or shorter trims may be required, or multiple flights chained with intermediate landings.
