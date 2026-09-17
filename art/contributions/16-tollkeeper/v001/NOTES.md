# Job 16 — Tollkeeper boss design reference candidate (v001)

## Summary
- **Job ID**: `16-tollkeeper`
- **Role**: Primary climax boss design reference for Ashen Vesper.
- **Contract**: 1024 × 1024 true RGBA PNG, nominal runtime height 220 units (scale ~0.2389, 1.72× hero standing height of 128 units), ground pivot at `(420, 972)`.
- **Status**: `candidate` (preservation registered, pending future six-stage clapper slam motion sheet and boss arena integration).

## Art Direction & Design Alignment
- **Costume & Anatomy**: Tall, gaunt abbey bell-keeper draped in layered, tattered ash-indigo and slate-charcoal vestments. Exposed weathered iron plate joints and articulated gauntlets.
- **Bell Harness**: Heavy cracked bronze bell shoulder harness encircling the cowl and collar with authentic green-gold bronze patina and fracture lines.
- **Weapon**: Heavy two-handed bronze bell clapper staff held vertically in right-facing profile, anchored to floor contact at `(525, 942)`.
- **Core**: Restrained warm amber reliquary core embedded in the chest beneath the bronze harness at `(505, 351)` with glowing peak luminance `[255, 229, 118]`.
- **Silhouette & Exterior**: Strict right-facing 2D orthographic elevation. True RGBA cutout with connected flood-fill exterior matting; interior folds and deep armor crevices remain 100% opaque (`alpha = 255`).
- **Margins & Safety**: Outer perimeter clearance exceeds 51px on all 4 sides (left 112px, right 266px, top 51px, bottom 51px), strictly satisfying the > 16px brief requirement and the > 32px test suite standard.

## Technical Landmarks
- **Bell Harness Crown Top**: `(484, 51)`
- **Amber Reliquary Core**: `(505, 351)`
- **Staff Hand Grip**: `(641, 393)`
- **Clapper Head (Top)**: `(637, 61)`
- **Clapper Base (Floor)**: `(525, 942)`
- **Ground Contact Pivot**: `(420, 972)`
- **Standing Height (Crown to Feet)**: 921 source pixels
- **Visible Silhouette Height**: 922 source pixels (`y = 51..972`)
- **Visible Silhouette Width**: 646 source pixels (`x = 112..757`)
- **Runtime Scale**: `220 / 921 ≈ 0.23887`

## File Manifest & Preserved Hashes
- **Untouched Generator Source**:
  - Path: `art/contributions/16-tollkeeper/v001/source/tollkeeper-boss-generated-v001.jpg`
  - Size: 530,586 bytes
  - SHA-256: `30836dcad17d04d8306aac866eabd965a28d8238c9ba18a7bc6341891f3b5e64`
- **Preserved Export Cutout**:
  - Path: `art/contributions/16-tollkeeper/v001/exports/tollkeeper-design-v001.png`
  - Dimensions: 1024 × 1024 (Color Type 6, RGBA)
  - Size: 766,063 bytes
  - SHA-256: `0ad2abf73e45dcfe4e21527d242cbdc38654e01beb94bc956d144093e00f51e6`
- **Review Composite**:
  - Path: `docs/reviews/tollkeeper-boss-v001.png`
  - Dimensions: 1920 × 1080
  - Size: 1,414,314 bytes
  - SHA-256: `87cf49f0abb59b04d8c72027a6e8bdc558d5debb30bb3f7e5b2816f19b70c0be`

## Generation Budget & Transformation
- **Generator**: Google Imagen 3 (1:1 canvas, flat jet black background #000000).
- **Attempts**: 1 initial generation candidate.
- **Transformation Pipeline**:
  1. Connected flood fill from outer canvas borders at threshold 14 to detect true background.
  2. Exterior boundary anti-aliasing while keeping 100% of interior fabric folds, bronze shading, and amber core fully opaque.
  3. Scaled uniformly by 0.95 and centered to provide >= 51px clear margins on all sides.
  4. Verified 0 border violations on the 32px perimeter.

## Outstanding Items / Future Work
- This PR delivers the design reference only.
- Subsequent animation job: Six-stage physical clapper slam sequence (ready, brace, overhead warning, descending swing, floor contact, vulnerable recovery) across a 2304 × 1536 true-alpha sheet.
- Boss gameplay systems (12 HP, 1 damage per slam, 1.2s warning tell, 0.35s slam, 1.3s punishable recovery) and dedicated 1280-wide arena remain separate future tasks.
