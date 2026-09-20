# Job 12 — Iron Sexton: 8-Pose Heavy Enemy Motion Sheet (v003)

## Overview & Context
- **Job ID**: `12-iron-sexton`
- **Version**: `v003`
- **Status**: `candidate` (motion sheet)
- **Direct Response to Maintainer Milestone**: Directly fulfills Milestone M2.1 in `docs/NEXT_MILESTONES.md`:
  > *"M2.1 Iron Sexton motion/AI (art then code): use selected reference; eight poses and physical shovel contact. Implement bait/miss/recovery and wall behavior with current movement."*
  And resolves the maintainer directive in `docs/CLOISTER_RUNTIME_REVIEW.md`:
  > *"The current enemy reuses the Hollow Pilgrim motion set. The Iron Sexton reference still needs an authored motion sheet before it can replace that placeholder."*

## Technical Specifications
- **Raw Generator Source**: `art/contributions/12-iron-sexton/v003/source/iron-sexton-motion-generated-v001.jpg`
  - Format: 1376 × 768 JPEG
  - SHA-256: `e7b67cb74c7770b4f225f3619a691d53e229b39e865b86472f87aef6453db90f`
- **Export Cutout Sheet**: `art/contributions/12-iron-sexton/v003/exports/iron-sexton-motion-v001.png`
  - Format: 2048 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha channel)
  - SHA-256: `d0e294b0d02baf60010572c9ec5678740143f314ddeba115eba8f83b5df04a34`
- **Review Composite**: `docs/reviews/iron-sexton-motion-v001.png`
  - Format: 1680 × 1200 PNG
  - SHA-256: `bc3c767cd4f6cd36334d7259237c65f93c628b3898f294225dd0baf2f4eb35e5`

## Sheet Grid & Frame Definitions
- **Grid Layout**: 4 columns × 2 rows of fixed $512 	imes 512$ px cells on a $2048 	imes 1024$ RGBA canvas
- **Shared Ground Anchor**: Local `[208, 464]` inside every cell (matching `docs/art-jobs/12-iron-sexton.md`)
- **Standing Source Height**: 400 px in neutral idle stance
- **Runtime Height**: **160 game units** (uniform scale $0.4$, hero is 144 units)
- **Cell Padding**: Every cell strictly enforces $ge 12$ px outer margin (measured minimum is $16$ px, 0 boundary violations)
- **Sheet Outer Perimeter**: Exactly 0 violations across all outer 32 px pixels of the $2048 	imes 1024$ canvas.

### 8 Authored Poses & Landmarks
1. `idle` (col 0, row 0): duration $0.60\text{s}$, local bounds $[97, 65]$ to $[460, 464]$ ($364 \times 400\text{px}$). Shovel tip $[460, 245]$, shovel butt $[97, 324]$. Heavy grounded stance holding shovel in two hands.
2. `step-a` (col 1, row 0): duration $0.25\text{s}$, local bounds $[97, 67]$ to $[459, 464]$ ($363 \times 398\text{px}$). Shovel tip $[459, 246]$, shovel butt $[97, 325]$. Forward stride step with weight transfer.
3. `step-b` (col 2, row 0): duration $0.25\text{s}$, local bounds $[97, 67]$ to $[461, 464]$ ($365 \times 398\text{px}$). Shovel tip $[461, 246]$, shovel butt $[97, 325]$. Passing leg stride forward with heavy boots.
4. `brace` (col 3, row 0): duration $0.30\text{s}$, local bounds $[87, 104]$ to $[451, 464]$ ($365 \times 361\text{px}$). Shovel tip $[451, 266]$, shovel butt $[87, 338]$. Low combat brace planting feet firmly.
5. `windup` (col 0, row 1): duration $0.90\text{s}$, local bounds $[97, 45]$ to $[462, 464]$ ($366 \times 420\text{px}$). Shovel tip $[97, 60]$, shovel butt $[462, 75]$. High overhead shovel raise; deliberate bait window for hero.
6. `contact` (col 1, row 1): duration $0.30\text{s}$, local bounds $[97, 111]$ to $[495, 464]$ ($399 \times 354\text{px}$). Shovel tip $[495, 434]$, shovel butt $[97, 161]$. Heavy physical cleave slamming shovel cutting blade into floor.
7. `recover` (col 2, row 1): duration $1.10\text{s}$, local bounds $[98, 104]$ to $[484, 463]$ ($387 \times 360\text{px}$). Shovel tip $[484, 443]$, shovel butt $[98, 164]$. Grounded committed follow-through; prime punish window for counter-attack.
8. `hurt` (col 3, row 1): duration $0.40\text{s}$, local bounds $[80, 94]$ to $[479, 464]$ ($400 \times 371\text{px}$). Shovel tip $[479, 261]$, shovel butt $[80, 335]$. Staggered recoil from hero strike while keeping two-handed grip on weapon.

## Combat Tuning Targets (M2.1 Contract)
- **HP**: 4 hits to defeat (vs Hollow Pilgrim 3 hits)
- **Damage**: 1 heart per physical cleave contact
- **Movement Speed**: ~45 units/s slow deliberate patrol/approach
- **Windup Duration**: $0.90\text{s}$ telegraphed anticipation
- **Cleave Duration**: $0.30\text{s}$ downward physical impact
- **Recovery Duration**: $1.10\text{s}$ committed recovery delay
