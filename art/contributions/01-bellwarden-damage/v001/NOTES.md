# Job 01 — Bellwarden: 4-Pose Damage Reaction & Death Motion Sheet (v001)

## Overview & Context
- **Job ID**: `01-bellwarden-damage`
- **Version**: `v001`
- **Status**: `candidate`
- **Direct Fulfillment of Priority 1 in `docs/WANTED_ASSETS.md`**:
  > *"1. Bellwarden hurt and death — the biggest hole: The player has no damage reaction at all. The hero atlas has eight frames: idle, four walk, three attack. A hit is shown by flickering the current pose to 40% alpha. Five health points, invulnerability frames, death and respawn all exist in the simulation with nothing behind them. Two poses, same sheet conventions as bellwarden-pilot-v001: a short recoil and a collapse. Same grid, same ground anchor, 144-unit runtime height."*

## Technical Specifications
- **Raw Generator Source**: `art/contributions/01-bellwarden-damage/v001/source/bellwarden-damage-generated-v001.jpg`
  - Format: 1024 × 1024 JPEG
  - SHA-256: `8686c29503884743710b050e6d8e42bd95843903b1386c55734e31c3b55cf322`
- **Export Cutout Sheet**: `art/contributions/01-bellwarden-damage/v001/exports/bellwarden-damage-v001.png`
  - Format: 1024 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha channel)
  - SHA-256: `04a51cf14669c3d0965f7c6f6f208993bf8b246a22d8dbf7cd50fbe2eff9c5ec`
- **Review Composite**: `docs/reviews/bellwarden-damage-v001.png`
  - Format: 1680 × 1260 PNG
  - SHA-256: `7500ac8e2038176ec7877ef41cfe774a0341d5057a2aebf20ca2bd238dd0bdb3`

## Sheet Grid & Frame Definitions
- **Grid Layout**: 2 columns × 2 rows of fixed $512 \times 512$ px cells on a $1024 \times 1024$ RGBA canvas.
- **Shared Ground Anchor**: Local `[256, 464]` across all four cells.
- **Standing Source Height**: Exactly **418 px** in neutral recoil pose, matching `bellwarden-pilot-v001` (`referenceHeight: 418`).
- **Runtime Height**: Exactly **144 game units** (uniform scale $144 / 418 \approx 0.3445$).
- **Cell Safety Margin**: Minimum measured margin is **30 px** (substantially exceeding the $\ge 12$ px requirement).
- **Sheet Outer Perimeter**: Exactly 0 violations across all outer 32 px perimeter pixels of the $1024 \times 1024$ canvas.
- **Connected Mesh Contiguity**: **Exactly 1 connected component in every cell (0 detached fragments)**. The arming sword stays unbroken and firmly gripped in hand.

### 4 Authored Poses & Landmarks
1. `hurt` (col 0, row 0): duration $0.35\text{s}$, local bounds $[124, 47]$ to $[390, 464]$ ($267 \times 418\text{px}$, standing height $418\text{px}$). Head top $[200, 47]$, sword tip $[390, 400]$. Upright recoil flinching backwards from impact.
2. `stagger` (col 1, row 0): duration $0.40\text{s}$, local bounds $[97, 113]$ to $[410, 464]$ ($314 \times 352\text{px}$). Head top $[240, 113]$, sword tip $[410, 480]$. Heavy stagger stumbling backwards onto rear knee.
3. `collapse` (col 0, row 1): duration $0.45\text{s}$, local bounds $[103, 135]$ to $[406, 464]$ ($304 \times 330\text{px}$). Head top $[245, 135]$, sword tip $[330, 464]$. Forward collapse dropping onto both knees with bowed head.
4. `death` (col 1, row 1): duration $0.80\text{s}$, local bounds $[30, 320]$ to $[478, 464]$ ($449 \times 145\text{px}$). Head top $[478, 390]$, sword tip $[380, 464]$. Defeated collapse lying flat and motionless upon the stone floor.
