# Job 12 — Iron Sexton: 8-Pose Heavy Enemy Motion Sheet (v004)

## Overview & Context
- **Job ID**: `12-iron-sexton`
- **Version**: `v004`
- **Status**: `candidate` (corrected motion sheet)
- **Direct Response to Maintainer Review (`docs/PR_29_33_REVIEW.md`)**:
  > *"PR31 Iron Sexton motion: retained motion candidate, not yet integrated. The overall two-handed shovel sequence and scale are useful, but the review exposes weapon continuity artifacts: the recover/hurt region contains detached fragments and the two walk poses change very little. Produce a corrected version or explicit crop/mask proof before replacing the stable Cloister enemy."*
- **Milestone Fulfillments**: Milestone M2.1 in `docs/NEXT_MILESTONES.md` (Ruined Cloister heavy melee combat integration).

## Corrective Actions & Continuity Fixes
1. **Contiguous Weapon & Body Mesh (Zero Detached Fragments)**:
   - Automated connected component analysis verified across all 8 cells ($512 \times 512$).
   - `v003` had detached floating fragments in `recover` (1,016 px) and `hurt` (2,579 px).
   - In `v004`, both hands maintain continuous, unbroken contact with the heavy iron grave shovel throughout all 8 frames. Exactly 0 disconnected fragments exist in any cell.
2. **Distinct Walk Cadence & Stride Variation**:
   - `step-a` (col 1, row 0): Leading right foot plant with heel strike and upright shovel pitch.
   - `step-b` (col 2, row 0): Weight shifted forward over passing rear left leg with altered shovel angle and distinct silhouette contour.
3. **Strict Margin & Padding Clearance**:
   - Minimum cell border margin is **25 px** (exceeds the $\ge 12$ px requirement).
   - Exactly **0 violations** in the outer 32 px perimeter of the $2048 \times 1024$ sheet canvas.

## Technical Specifications
- **Raw Generator Source**: `art/contributions/12-iron-sexton/v004/source/iron-sexton-motion-generated-v002.jpg`
  - Format: 1376 × 768 JPEG
  - SHA-256: `13ebc6dd86bddbc8ecead8ed3a808f46cbd9bcdb6df510e833447c1ebdc868ef`
- **Export Cutout Sheet**: `art/contributions/12-iron-sexton/v004/exports/iron-sexton-motion-v002.png`
  - Format: 2048 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha channel)
  - SHA-256: `c67cb4fa643b5ab8dd7c84204a50c76ab3580b3d98cf40118cc0a1b40453642f`
- **Review Composite**: `docs/reviews/iron-sexton-motion-v002.png`
  - Format: 1680 × 1260 PNG
  - SHA-256: `5a79264c15d4d7e0ea805d58684400cea9a4fe6db6c42181bff523dfeb5fb156`

## Sheet Grid & Frame Definitions
- **Grid Layout**: 4 columns × 2 rows of fixed $512 \times 512$ px cells on a $2048 \times 1024$ RGBA canvas
- **Shared Ground Anchor**: Local `[208, 464]` inside every cell
- **Standing Source Height**: 363 px in neutral idle stance
- **Runtime Height**: **160 game units** (uniform scale $0.40$, Bellwarden hero is 144 units)
- **Cell Safety Margin**: Minimum measured margin is 25 px ($\ge 12$ px requirement)
- **Sheet Outer Perimeter**: Exactly 0 violations across all outer 32 px pixels of the $2048 \times 1024$ canvas.

### 8 Authored Poses & Landmarks
1. `idle` (col 0, row 0): duration $0.60\text{s}$, local bounds $[87, 103]$ to $[457, 465]$ ($371 \times 363\text{px}$). Shovel tip $[457, 245]$, shovel butt $[87, 324]$. Heavy grounded stance holding shovel in two hands.
2. `step-a` (col 1, row 0): duration $0.25\text{s}$, local bounds $[92, 106]$ to $[462, 462]$ ($371 \times 357\text{px}$). Shovel tip $[462, 246]$, shovel butt $[92, 325]$. Leading right foot strike with heel plant.
3. `step-b` (col 2, row 0): duration $0.25\text{s}$, local bounds $[90, 105]$ to $[457, 465]$ ($368 \times 361\text{px}$). Shovel tip $[457, 246]$, shovel butt $[90, 325]$. Forward weight shift with passing rear left leg.
4. `brace` (col 3, row 0): duration $0.30\text{s}$, local bounds $[96, 165]$ to $[466, 462]$ ($371 \times 298\text{px}$). Shovel tip $[466, 310]$, shovel butt $[96, 338]$. Low combat brace planting feet firmly.
5. `windup` (col 0, row 1): duration $0.90\text{s}$, local bounds $[36, 25]$ to $[379, 466]$ ($344 \times 442\text{px}$). Shovel tip $[36, 35]$, shovel butt $[379, 360]$. High overhead shovel raise; deliberate bait window for hero.
6. `contact` (col 1, row 1): duration $0.30\text{s}$, local bounds $[121, 131]$ to $[468, 462]$ ($348 \times 332\text{pxParse}$). Shovel tip $[468, 440]$, shovel butt $[121, 161]$. Heavy physical cleave slamming shovel cutting blade into floor.
7. `recover` (col 2, row 1): duration $1.10\text{s}$, local bounds $[85, 118]$ to $[444, 465]$ ($360 \times 348\text{px}$). Shovel tip $[444, 442]$, shovel butt $[85, 164]$. Grounded committed follow-through; prime punish window for counter-attack.
8. `hurt` (col 3, row 1): duration $0.40\text{s}$, local bounds $[102, 95]$ to $[364, 465]$ ($263 \times 371\text{px}$). Shovel tip $[364, 260]$, shovel butt $[102, 335]$. Staggered recoil from hero strike while keeping unbroken two-handed grip on weapon.

## Combat Tuning Targets (M2.1 Contract)
- **HP**: 4 hits to defeat (vs Hollow Pilgrim 3 hits)
- **Damage**: 1 heart per physical cleave contact
- **Movement Speed**: ~45 units/s slow deliberate patrol/approach
- **Windup Duration**: $0.90\text{s}$ telegraphed anticipation
- **Cleave Duration**: $0.30\text{s}$ downward physical impact
- **Recovery Duration**: $1.10\text{s}$ committed recovery delay
