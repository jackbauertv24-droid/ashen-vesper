# World 04: Ossuary Gallery — Burial Niche Wall Panel Module (v002)

## Overview & Purpose
- **Stage ID**: `04-ossuary-gallery`
- **Module**: `niche-panel`
- **Version**: `v002`
- **Status**: `candidate` (versioned clean derivative)
- **Direct Response to Maintainer Review (`docs/PR_22_28_REVIEW.md`)**:
  > *"PR 26 niche panel: retained background-decoration candidate. Generated pseudo-lettering in the lower inscription conflicts with the no-lettering brief; remove it in a versioned derivative or obscure it with an intentional original relief. It is not collision or a door."*
- **Milestone Alignment**: Fulfills Milestone M4.2 in `docs/NEXT_MILESTONES.md` ("Stage04 blockout plus versioned niche panel without pseudo-lettering").

## Corrective Actions in v002
1. **Clean Memorial Tablet (Zero Pseudo-Lettering)**:
   - The lower sarcophagus plinth memorial tablet has been generated and validated as smooth, uncarved limestone.
   - Exactly zero AI glyphs, pseudo-letters, or illegible markings exist on the tablet or panel.
2. **Strict Margin Clearance**:
   - Minimum measured margin is **58 px** (exceeds the $\ge 16$ px requirement).
   - Outer 32 px perimeter of the $1024 \times 1024$ canvas contains exactly 0 alpha violations.
3. **Contiguous Architecture**:
   - Connected component analysis confirms a single contiguous architectural wall panel module (0 detached floating debris).

## Technical Specifications
- **Raw Generator Source**: `art/contributions/world-04-ossuary-gallery/v002/source/niche-panel-generated-v002.jpg`
  - Format: 1024 × 1024 JPEG
  - SHA-256: `781dd093a9cec442a20829323f5365cc1d8b13476b67dfec285b052e2787fe55`
- **Export Cutout**: `art/contributions/world-04-ossuary-gallery/v002/exports/niche-panel-v002.png`
  - Format: 1024 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha channel)
  - SHA-256: `35689b97b001d030e4c2f86d85bb8ff824de91b272e0f83f7a81898afe49202c`
- **Review Composite**: `docs/reviews/ossuary-niche-panel-v002.png`
  - Format: 1680 × 1260 PNG
  - SHA-256: `cb356d30ab45c897f4ca280b462909e6e6e13fa084cdab6dcb2cf45f43d32ce0`

## Geometry & Contract Alignment
- **Canvas & Scaling**:
  - Source canvas: 1024 × 1024 RGBA.
  - Runtime canvas: 240 × 240 at uniform scale `240 / 1024` (~0.234375), matching architectural standard in `docs/world/README.md`.
- **Ground Alignment & Pivot**:
  - Ground pivot: `(512, 940)` source -> `(120, 220)` runtime.
  - Sarcophagus base rests naturally on stage floor baseline at `y = 940`.
- **Measured Bounds**:
  - `minX = 58`, `maxX = 965` (width 908 px).
  - `minY = 83`, `maxY = 940` (height 858 px).
- **Clearance Margins**:
  - Left margin: 58 px (≥ 16 px requirement).
  - Right margin: 58 px (≥ 16 px requirement).
  - Top margin: 83 px (≥ 16 px requirement).
  - Bottom margin: 83 px (≥ 16 px requirement).
  - Outer 32 px perimeter violations: 0.

## Material & Architectural Role
- **Atmosphere & Layer**:
  - Decorative background wall module for Stage 04 Ossuary Gallery (`04-A`, `04-B`, `04-C`).
  - Renders behind the player traversal plane without collision.
