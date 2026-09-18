# World 04: Ossuary Gallery — Burial Niche Wall Panel Module (v001)

## Overview & Purpose
This contribution delivers the foundational **Ossuary Gallery Burial Niche Wall Panel Module** (`niche-panel-v001.png`), specified in `docs/world/stages/04-ossuary-gallery.md` (Asset queue & First bounded art PR: "one niche wall panel; document whether it is background or a decorative alpha cutout") and `docs/world/README.md` (Exact shared asset defaults).

It functions as an architectural wall panel and burial loculus module for the 3 rooms of Stage 04 Ossuary Gallery (`04-A`, `04-B`, `04-C`), creating the quiet, somber Gothic burial gallery atmosphere with carved pale limestone ashlar masonry, an arched burial alcove with wrought-iron grillework, and an inscribed sepulchral sarcophagus plinth with memento mori reliefs.

## Technical Specifications
- **Source Image**: `art/contributions/world-04-ossuary-gallery/v001/source/niche-panel-generated-v001.jpg`
  - Dimensions: 1024 × 1024 JPEG
  - SHA-256: `e46299ba82d5f44c716303388d7866b480c631d3ac65db2a5c862d4050480a6d`
  - Bytes: 395,081
- **Export Cutout**: `art/contributions/world-04-ossuary-gallery/v001/exports/niche-panel-v001.png`
  - Dimensions: 1024 × 1024 RGBA PNG (Color Type 6, 8-bit depth)
  - SHA-256: `9c2961c1e81dac1943af3a0db1a7f537abbeb85a98c8aa343138120045fa2360`
  - Bytes: 1,326,985
- **Review Composite**: `docs/reviews/ossuary-niche-panel-v001.png`
  - Dimensions: 1440 × 1040 PNG
  - SHA-256: `343d18aadb1ab4f663b8f7cfb7ab0fc3da3322942d4e71a0b21d22b51e42a59b`
  - Bytes: 1,446,145

## Geometry & Contract Alignment
- **Canvas & Scaling**:
  - Source canvas: 1024 × 1024 RGBA.
  - Nominal runtime canvas: 240 × 240 at uniform scale `240 / 1024` (~0.234375), conforming to architectural defaults in `docs/world/README.md` line 83.
- **Pivots & Ground Alignment**:
  - Ground pivot: `(512, 960)` source -> `(120, 225)` runtime.
  - Sarcophagus base rests naturally on the stage floor baseline at source `y = 960`.
- **Measured Silhouette Bounds**:
  - `minX = 71`, `maxX = 952` (width 882px = 206.7 runtime units).
  - `minY = 23`, `maxY = 1000` (height 978px = 229.2 runtime units).
- **Clearance & Safe Margins**:
  - Left margin: 71px (≥ 16px safe clearance).
  - Right margin: 71px (≥ 16px safe clearance).
  - Top margin: 23px (≥ 16px safe clearance).
  - Bottom margin: 23px (≥ 16px safe clearance).
  - Border violations: 0 across all 4 outer margins.

## Material & Aesthetic Harmony
- **Limestone & Iron Construction**:
  - Pale weathered ashlar limestone blocks matching the material scale of Stage 01 Abbey masonry and Stage 02 Cloister piers.
  - Ornate wrought-iron lattice grille shielding the recessed tomb crypt.
  - Carved stone sarcophagus plinth with Latin sepulchral inscription and skull-and-crossbones relief.
- **Layer & Gameplay Purpose**:
  - Decorative mid-ground architectural wall panel mounted behind the player traversal plane.
  - Does not introduce collision hazards or block player passage.

## Status & Integration Notes
- Candidate status: ready for baseline layout review and future integration into Ossuary Gallery stage assemblies once room graph and camera transitions are loaded.
