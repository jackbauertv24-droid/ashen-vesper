# Job 08 / Stage 02 — Ruined Cloister Gothic Arcade Kit candidate (v001)

## Summary
- **Job ID**: `08-ruined-cloister`
- **Role**: Primary architectural colonnade and arcade modules for Stage 02 (Ruined Cloister).
- **Modules Delivered**:
  1. **Gothic Arcade Arch Span** (`cloister-arch-span-v001.png`): Pointed lancet arch with pierced trefoil tracery and flat upper entablature.
  2. **Gothic Arcade Pier** (`cloister-pier-v001.png`): Clustered compound column with carved foliate capital, abacus plate, moulded base, and upper pier impost.
- **Contract**: 1024 × 1024 true RGBA PNG, nominal runtime canvas 240 × 240 units (scale ~0.2344), common ground pivot at `(512, 960)`.
- **Status**: `candidate` (preservation registered, fulfilling Job 08's "one arch span and one pier" brief; pending platform cap and full Stage 02 layout integration).

## Art Direction & Architectural Alignment
- **Gothic Language**: Weathered ashlar limestone arcade kit matching the project's cool blue-gray moonlit palette, subtle fractures, and restrained green moss in mortar joints.
- **Modular Sockets & Alignment**:
  - **Arch Span**: Springline at source `y = 530`, top entablature at `y = 41`, ground pivot at `(512, 960)`. Pierced lancet opening (`x = 313..699`) and interior trefoil tracery foils (`x = 512, y = 336`) with 100% genuine alpha (`alpha = 0`).
  - **Arcade Pier**: Ground pivot at `(512, 960)`, base footing at `y = 980`, foliate capital abacus at `y = 341` (span `[362, 660]`, width 299px), shaft width 202px centered at `x = 511.5`, top contact at `y = 44` (width 174px).
  - **Arcade Colonnade Assembly**: When paired, the pier and arch span form seamless colonnades, open loggias, and ruined arcade galleries where arches rest naturally on flanking piers at common ground pivot `(512, 960)`.
- **Margins & Safety**:
  - Arch Span: Left 119px, Right 119px, Top 41px, Bottom 38px (0 border violations at 32px standard).
  - Arcade Pier: Left 362px, Right 362px, Top 44px, Bottom 43px (0 border violations at 32px standard).

## Technical Landmarks & Sockets

### Module 1: Gothic Arch Span
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

### Module 2: Gothic Arcade Pier
- **Ground Pivot Anchor**: `(512, 960)`
- **Base Footing Bottom**: `y = 980`
- **Top Impost Surface**: `y = 44` (Source) → 10.3 units from top at runtime scale
- **Capital Abacus Level**: `y = 341` (Source), span `x = 362..660` (width 299px)
- **Shaft Section (y=600)**: `x = 411..612` (width 202px, center X = 511.5)
- **Visible Silhouette Bounds**: `x = 362..661` (width 300px), `y = 44..980` (height 937px)

## File Manifest & Preserved Hashes
- **Module 1 (Arch Span)**:
  - Source: `art/contributions/08-ruined-cloister/v001/source/cloister-arch-span-generated-v001.jpg` (SHA-256: `dd198a2cfddb505a14861ca3a3bb19c2d270a1be38b1aba0736de2afcb3c1c79`, 621,351 bytes)
  - Export: `art/contributions/08-ruined-cloister/v001/exports/cloister-arch-span-v001.png` (SHA-256: `3bc3c7359f7f2ce2d587f0afd73e5982042365e1415710d746551040bc79451e`, 1,191,480 bytes)
  - Review: `docs/reviews/cloister-arch-span-v001.png` (SHA-256: `35da35066798612b3aaf86543788d1a872e18f08872bf6e50805b296582d2f54`, 1,611,394 bytes)
- **Module 2 (Arcade Pier)**:
  - Source: `art/contributions/08-ruined-cloister/v001/source/cloister-pier-generated-v001.jpg` (SHA-256: `b31f16728b2a90ca342ddb4391095a74baf561c46a21d18ba37031d7d64f8cae`, 577,419 bytes)
  - Export: `art/contributions/08-ruined-cloister/v001/exports/cloister-pier-v001.png` (SHA-256: `4569ced2b7b2bd64240d7abe4d0b987da7619e9d5ffd9782a2fd26a763def2d6`, 467,063 bytes)
  - Review: `docs/reviews/cloister-pier-v001.png` (SHA-256: `31afee209632c66845b164a7c256539397ef140c9ecb6e7c5025f5c953c175ef`, 508,080 bytes)

## Generation Budget & Transformation
- **Generator**: Google Imagen 3 (1:1 canvas, flat jet black background #000000).
- **Attempts**: 1 generation candidate per module (2 total attempts).
- **Transformation Pipeline**:
  1. Connected exterior flood fill from outer borders to carve clean silhouettes.
  2. Targeted seed flood fill for pierced internal tracery negative spaces (Arch Span).
  3. Preserved 100% opacity (`alpha = 255`) across all solid carved stone surfaces.
  4. Verified 0 border violations on the 32px perimeter across both modules.

## Outstanding Items / Future Work
- Fulfills the "one arch span and one pier" deliverable for Job 08 (`docs/art-jobs/08-ruined-cloister.md`).
- Subsequent kit assets: walkable platform cap with 3-copy seam, background arcade parallax layer, and dry fountain prop.
- Stage 02 room layout blockout (`docs/world/stages/02-ruined-cloister.md`) remains a separate layout task.

