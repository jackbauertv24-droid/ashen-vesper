# Job 13 — Cistern Lurker: 6-Pose Low Ambush Enemy Motion Sheet (v003)

## Overview & Context
- **Job ID**: `13-cistern-lurker`
- **Version**: `v003`
- **Status**: `candidate` (motion sheet)
- **Direct Response to Maintainer Milestone**: Directly fulfills Milestone M3.3 in `docs/NEXT_MILESTONES.md`:
  > *"M3.3 Lurker motion/AI: use selected reference; six poses, visible emerge warning, low blade/core contact, jump avoidance, safe respawn placement."*

## Technical Specifications
- **Raw Generator Source**: `art/contributions/13-cistern-lurker/v003/source/cistern-lurker-motion-generated-v001.jpg`
  - Format: 1264 × 848 JPEG
  - SHA-256: `db82a9bab7f97b4e00b4f29778d3a4d0edc6a1bf98a640bac32b86e8691df096`
- **Export Cutout Sheet**: `art/contributions/13-cistern-lurker/v003/exports/cistern-lurker-motion-v001.png`
  - Format: 1536 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha channel)
  - SHA-256: `9909a79383d144b26416a10e379d749f645c1ae58482a567e4df152aa15a56c0`
- **Review Composite**: `docs/reviews/cistern-lurker-motion-v001.png`
  - Format: 1536 × 1120 PNG
  - SHA-256: `8e53c525130f1e03df8fc0e1d451e716cfd646e8cdacf5de15ad033b11f40ab5`

## Sheet Grid & Frame Definitions
- **Grid Layout**: 3 columns × 2 rows of fixed $512 \times 512$ px cells on a $1536 \times 1024$ RGBA canvas
- **Shared Ground Pivot**: Local `[256, 448]` inside every cell (matching `docs/art-jobs/13-cistern-lurker.md`)
- **Nominal Silhouette**: $321 \times 173$ px across crawl frames
- **Runtime Size**: **96 × 48 game units** (uniform scale $0.3$)
- **Cell Padding**: Every cell strictly enforces $\ge 12$ px outer margin (measured minimum is $62$ px, 0 boundary violations)
- **Sheet Outer Perimeter**: Exactly 0 violations across all outer 32 px pixels of the $1536 \times 1024$ canvas.

### 6 Authored Poses & Core Landmarks
1. `rest` (col 0, row 0): duration $0.50\text{s}$, local bounds $[129, 314]$ to $[382, 448]$ ($254 \times 135\text{px}$). Reliquary core $[312, 374]$. Hunkered dormant stone camouflage.
2. `emerge` (col 1, row 0): duration $0.70\text{s}$, local bounds $[102, 283]$ to $[410, 448]$ ($309 \times 166\text{px}$). Reliquary core $[325, 348]$. Chest rises, amber core ignites through grille (visible tell).
3. `crawl-a` (col 2, row 0): duration $0.25\text{s}$, local bounds $[96, 276]$ to $[416, 448]$ ($321 \times 173\text{px})$. Reliquary core $[334, 350]$. Low crawling quadrupedal locomotion stride.
4. `crawl-b` (col 0, row 1): duration $0.25\text{s}$, local bounds $[96, 278]$ to $[416, 449]$ ($321 \times 172\text{px})$. Reliquary core $[325, 345]$. Passing leg stride maintaining low silhouette.
5. `lunge` (col 1, row 1): duration $0.25\text{s}$, local bounds $[89, 272]$ to $[421, 447]$ ($333 \times 176\text{px}`). Reliquary core $[332, 340]$. Fast ground-level aggressive lunge thrust.
6. `recover` (col 2, row 1): duration $0.90\text{s}$, local bounds $[121, 216]$ to $[391, 449]$ ($271 \times 234\text{px}`). Reliquary core $[321, 276]$. Recoil onto hind legs exposing core to hero counter-attacks.

## Combat Tuning Targets (M3.3 Contract)
- **HP**: 2 hits to defeat
- **Damage**: 1 heart on lunge contact
- **Movement Speed**: ~35 units/s slow stalking crawl
- **Emerge Warning Duration**: $0.70\text{s}$ telegraphed anticipation
- **Lunge Duration**: $0.25\text{s}$ quick forward thrust
- **Recovery Duration**: $0.90\text{s}$ punishable delay
