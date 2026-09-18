# Job 08 / Stage 02 — Ruined Cloister Gothic Arch Span candidate (v001)

## Summary
- **Job ID**: `08-ruined-cloister`
- **Role**: Primary architectural colonnade and arcade module for Stage 02 (Ruined Cloister).
- **Contract**: 1024 × 1024 true RGBA PNG, nominal runtime canvas 240 × 240 units (scale ~0.2344), ground pivot at `(512, 960)`.
- **Status**: `candidate` (preservation registered, pending pier module, platform cap, and full Stage 02 layout integration).

## Art Direction & Architectural Alignment
- **Gothic Language**: Carved limestone Gothic arcade archway flanked by twin clustered columns supporting a pointed lancet arch with ornate trefoil tracery.
- **Entablature / Frieze**: Flat upper entablature at source `y = 41` designed to receive walkable stone platform caps for Stage 02's upper balustrade route.
- **Pierced Openings**: True RGBA negative spaces through the main archway (`x = 313..699`) and the interior trefoil tracery foils (`x = 512, y = 336`), allowing moonlit backdrop and distant bell tower to show through without a matte veil.
- **Masonry Texture**: Weathered ashlar limestone with cold blue-gray moonlight rim lighting, subtle micro-fractures, and muted dark green moss in mortar joints, matching existing `masonry-module-v001` and `masonry-causeway-arch-v001`.
- **Margins & Safety**: Outer perimeter clearance exceeds 38px on all 4 sides (left 119px, right 119px, top 41px, bottom 38px), strictly satisfying the ≥ 16px brief requirement and the ≥ 32px test suite standard.

## Technical Landmarks & Sockets
- **Ground Pivot Anchor**: `(512, 960)`
- **Plinth Base Bottom**: `y = 985`
- **Platform Top Surface**: `y = 41` (Source) → 9.6 units from top at runtime scale
- **Arch Springline Level**: `y = 530` (Source) at column capital astragal band
- **Left Column Center**: `x = 215`
- **Right Column Center**: `x = 808`
- **Span Between Column Centers**: 593 source pixels
- **Main Archway Opening**: Width 387 pixels (`x = 313..699`), height 460 pixels to cusps
- **Trefoil Center Opening**: `(512, 336)` (100% Alpha 0)
- **Flanking Tracery Foils**: `(398, 366)` and `(626, 366)` (100% Alpha 0)
- **Visible Silhouette Bounds**: `x = 119..904` (width 786px), `y = 41..985` (height 945px)

## File Manifest & Preserved Hashes
- **Untouched Generator Source**:
  - Path: `art/contributions/08-ruined-cloister/v001/source/cloister-arch-span-generated-v001.jpg`
  - Size: 621,351 bytes
  - SHA-256: `dd198a2cfddb505a14861ca3a3bb19c2d270a1be38b1aba0736de2afcb3c1c79`
- **Preserved Export Cutout**:
  - Path: `art/contributions/08-ruined-cloister/v001/exports/cloister-arch-span-v001.png`
  - Dimensions: 1024 × 1024 (Color Type 6, RGBA)
  - Size: 1,191,480 bytes
  - SHA-256: `3bc3c7359f7f2ce2d587f0afd73e5982042365e1415710d746551040bc79451e`
- **Review Composite**:
  - Path: `docs/reviews/cloister-arch-span-v001.png`
  - Dimensions: 1920 × 1080
  - Size: 1,611,394 bytes
  - SHA-256: `35da35066798612b3aaf86543788d1a872e18f08872bf6e50805b296582d2f54`

## Generation Budget & Transformation
- **Generator**: Google Imagen 3 (1:1 canvas, flat jet black background #000000).
- **Attempts**: 1 initial generation candidate.
- **Transformation Pipeline**:
  1. Flood fill from outer canvas borders at threshold 14 to extract exterior silhouette.
  2. Targeted seed flood fill into interior trefoil tracery and lancet negative spaces.
  3. Preserved 100% opacity (`alpha = 255`) across all solid carved stone ribs, ashlar blocks, and column shafts.
  4. Verified 0 border violations on the 32px perimeter.

## Outstanding Items / Future Work
- First architectural deliverable for Stage 02 (Ruined Cloister).
- Subsequent kit assets: standalone pier module, platform cap with 3-copy seam, background arcade parallax layer, and dry fountain prop.
- Stage 02 room layout blockout (`docs/world/stages/02-ruined-cloister.md`) remains a separate layout task.
