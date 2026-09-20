# Job 12 — Iron Sexton: 8-Pose Heavy Enemy Motion Sheet (v005)

## Overview & Context
- **Job ID**: `12-iron-sexton`
- **Version**: `v005`
- **Status**: `candidate` (restored hurt shovel & continuous weapon continuity)
- **Direct Response to Maintainer Review (`docs/PR_34_38_REVIEW.md`)**:
  > *"PR34 Iron Sexton motion cleanup (v004): retained candidate, not integrated. Both stated corrections are real and were confirmed. Connected-component analysis of all eight cells shows zero detached fragments... Walk cadence is genuinely distinct: step-a against step-b now differs by 68.9% of the union silhouette... It is still not integrable, for a new reason. The hurt cell has no shovel at all. v003 showed the Sexton holding the shovel with a broken-off blade fragment beside it; v004 removed the fragment by deleting the entire weapon... A v005 needs the shovel present and held in hurt; the other seven cells are good and should be carried over unchanged."*
- **Milestone Fulfillments**: Milestone M2.1 in `docs/NEXT_MILESTONES.md` (Ruined Cloister heavy melee combat integration).

## Corrective Actions & Continuity Fixes
1. **Shovel Restoration in Hurt Pose (`cell 7`)**:
   - Component analysis of v003 cell 7 revealed two components: Component 1 (64,798 px) comprising the complete Sexton body holding the entire grave shovel with both hands, and Component 2 (2,579 px) which was the detached artifact behind him.
   - In `v005`, Component 1 is preserved and Component 2 is completely removed.
   - Cell 7 now has **exactly 1 connected component** of 64,762 px (0 detached fragments).
   - The shovel is fully present, held in both hands, extending forward to local $x = 479$ with shovel tip at $[479, 261]$ and butt at $[87, 335]$.
   - Generous cell margins: left margin 87px, right margin 33px, top margin 94px, bottom margin 48px (all $\ge 32$px).
2. **Seven Cells Preserved from v004**:
   - Cells 0–6 are carried over directly from `v004`.
   - Distinct walk cadence between `step-a` and `step-b` is 100% preserved at **68.9% difference** of the union silhouette (independent maintainer metric).
   - Zero detached fragments across all 8 cells.
3. **Strict Padding & Margin Clearance**:
   - Minimum cell border margin is **25 px** ($\ge 12$ px requirement).
   - Exactly **0 violations** in the outer 32 px perimeter of the $2048 \times 1024$ canvas.

## Technical Specifications
- **Raw Generator Source**: `art/contributions/12-iron-sexton/v005/source/iron-sexton-motion-generated-v002.jpg`
  - Format: 1376 × 768 JPEG
  - SHA-256: `13ebc6dd86bddbc8ecead8ed3a808f46cbd9bcdb6df510e833447c1ebdc868ef`
- **Export Cutout Sheet**: `art/contributions/12-iron-sexton/v005/exports/iron-sexton-motion-v003.png`
  - Format: 2048 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha channel)
  - SHA-256: `42d11b5d7514f31eb08a882b2edbf436408af28f43dd0ab5b3582a51a65287d7`
- **Review Composite**: `docs/reviews/iron-sexton-motion-v003.png`
  - Format: 1680 × 1260 PNG

## Sheet Grid & Frame Definitions
- **Grid Layout**: 4 columns × 2 rows of fixed $512 \times 512$ px cells on a $2048 \times 1024$ RGBA canvas
- **Shared Ground Anchor**: Local `[208, 464]` inside every cell
- **Standing Source Height**: 362 px in neutral idle stance
- **Runtime Height**: **160 game units** (uniform scale $0.40$, Bellwarden hero is 144 units)
- **Cell Safety Margin**: Minimum measured margin is 25 px ($\ge 12$ px requirement)
- **Sheet Outer Perimeter**: Exactly 0 violations across all outer 32 px pixels of the $2048 \times 1024$ canvas.

### 8 Authored Poses & Landmarks
1. `idle` (col 0, row 0): duration $0.60\text{s}$, local bounds $[88, 104]$ to $[457, 465]$ ($370 \times 362\text{px}$). Shovel tip $[457, 245]$, shovel butt $[88, 324]$. Heavy grounded stance holding shovel in two hands.
2. `step-a` (col 1, row 0): duration $0.25\text{s}$, local bounds $[92, 106]$ to $[462, 462]$ ($371 \times 357\text{px}$). Shovel tip $[462, 246]$, shovel butt $[92, 325]$. Leading right foot strike with heel plant.
3. `step-b` (col 2, row 0): duration $0.25\text{s}$, local bounds $[90, 105]$ to $[457, 465]$ ($368 \times 361\text{px}$). Shovel tip $[457, 246]$, shovel butt $[90, 325]$. Forward weight shift with passing rear left leg (68.9% silhouette difference vs step-a).
4. `brace` (col 3, row 0): duration $0.30\text{s}$, local bounds $[96, 165]$ to $[466, 462]$ ($371 \times 298\text{px}$). Shovel tip $[466, 310]$, shovel butt $[96, 338]$. Low combat brace planting feet firmly.
5. `windup` (col 0, row 1): duration $0.90\text{s}$, local bounds $[36, 25]$ to $[379, 466]$ ($344 \times 442\text{px}$). Shovel tip $[36, 35]$, shovel butt $[379, 360]$. High overhead shovel raise; deliberate bait window for hero.
6. `contact` (col 1, row 1): duration $0.30\text{s}$, local bounds $[121, 131]$ to $[468, 462]$ ($348 \times 332\text{px}$). Shovel tip $[468, 440]$, shovel butt $[121, 161]$. Heavy physical cleave slamming shovel cutting blade into floor.
7. `recover` (col 2, row 1): duration $1.10\text{s}$, local bounds $[85, 118]$ to $[444, 465]$ ($360 \times 348\text{px}$). Shovel tip $[444, 442]$, shovel butt $[85, 164]$. Grounded committed follow-through; prime punish window for counter-attack.
8. `hurt` (col 3, row 1): duration $0.40\text{s}$, local bounds $[87, 94]$ to $[479, 464]$ ($393 \times 371\text{px}$). Shovel tip $[479, 261]$, shovel butt $[87, 335]$. Staggered recoil flinching backwards from hero strike while keeping unbroken two-handed grip on the entire grave shovel. Shovel extends forward to $x=479$ with blade intact, 0 detached fragments (64,762 px single connected component).

## Combat Tuning Targets (M2.1 Contract)
- **HP**: 4 hits to defeat (vs Hollow Pilgrim 3 hits)
- **Damage**: 1 heart per physical cleave contact
- **Movement Speed**: ~45 units/s slow deliberate patrol/approach
- **Windup Duration**: $0.90\text{s}$ telegraphed anticipation
- **Cleave Duration**: $0.30\text{s}$ downward physical impact
- **Recovery Duration**: $1.10\text{s}$ committed recovery delay
