# Job 16 — Tollkeeper Boss: 6-Pose Heavy Motion Sheet (v003)

## Overview & Context
- **Job ID**: `16-tollkeeper`
- **Version**: `v003`
- **Status**: `candidate` (boss motion sheet)
- **Direct Response to Maintainer Milestone & Review**:
  - Follows maintainer acceptance of PR #29 in `docs/PR_29_33_REVIEW.md`:
    > *"PR29 Tollkeeper two-handed reference: selected as the corrected design reference. The two-handed grip, complete silhouette and 220-unit lineup resolve the earlier design issue. Boss motion, arena and behavior remain separate work."*
  - Directly fulfills Milestone M4.5 and the First Motion Prompt in `docs/art-jobs/16-tollkeeper.md`:
    > *"Keep the selected Tollkeeper anatomy, harness, weapon, core and body scale identical. Six coherent stages of ONE physical clapper slam: ready; brace; overhead warning; descending swing; floor contact; vulnerable recovery. Both hands maintain believable grip, feet anchored, torso transfers weight, complete weapon within each cell. 2304 × 1536 true-alpha sheet, 3 × 2 cells of 768, ground pivot (320,704), 16px clear cell borders."*

## Technical Specifications
- **Raw Generator Source**: `art/contributions/16-tollkeeper/v003/source/tollkeeper-motion-generated-v001.jpg`
  - Format: 1376 × 768 JPEG
  - SHA-256: `4d9fd7354f7c81d754b9a5ea7b8b557c3d931dc44554a6060d938d70d1d32c50`
- **Export Cutout Sheet**: `art/contributions/16-tollkeeper/v003/exports/tollkeeper-motion-v001.png`
  - Format: 2304 × 1536 RGBA PNG (Color Type 6, 8-bit truecolor with alpha channel)
  - SHA-256: `2f8adb77d26b6e51b5ffbf85e4c0ee201f73e76ac55747044f4ca398ae491666`
- **Review Composite**: `docs/reviews/tollkeeper-motion-v001.png`
  - Format: 1728 × 1296 PNG
  - SHA-256: `60651c4aaee890fe7fd30ef846c129e4611d4b97f5a1fdfc3771c0d8c5e46b42`

## Sheet Grid & Frame Definitions
- **Grid Layout**: 3 columns × 2 rows of fixed $768 \times 768$ px cells on a $2304 \times 1536$ RGBA canvas
- **Shared Ground Pivot**: Local `[320, 704]` inside every cell
- **Standing Source Height**: 560 px in neutral ready stance
- **Runtime Height**: **220 game units** (scale $0.392857$, Bellwarden hero is 144 units)
- **Cell Safety Margin**: Minimum measured margin is **44 px** ($\ge 16$ px requirement)
- **Sheet Outer Perimeter**: Exactly 0 violations across all outer 32 px pixels of the $2304 \times 1536$ canvas
- **Connected Components**: Exactly 0 detached floating fragments across all 6 cells (100% contiguous body and weapon mesh)

### 6 Authored Slam Stages & Landmarks
1. `ready` (col 0, row 0): duration $0.60\text{s}$, local bounds $[128, 147]$ to $[665, 706]$ ($538 \times 560\text{px}$). Upright two-handed combat stance holding heavy bronze clapper staff. Head apex $[320, 147]$, amber core $[300, 320]$, clapper head $[640, 310]$.
2. `brace` (col 1, row 0): duration $0.40\text{s}$, local bounds $[133, 190]$ to $[703, 705]$ ($571 \times 516\text{px}$). Weight shifted back onto rear leg in low combat brace. Head apex $[320, 190]$, amber core $[290, 350]$, clapper head $[680, 420]$.
3. `warning` (col 2, row 0): duration $1.20\text{s}$, local bounds $[173, 90]$ to $[589, 708]$ ($417 \times 619\text{px}$). High overhead raise telegraphed anticipation window. Head apex $[310, 175]$, amber core $[300, 330]$, clapper head $[280, 95]$.
4. `swing` (col 0, row 1): duration $0.35\text{s}$, local bounds $[44, 100]$ to $[707, 705]$ ($664 \times 606\text{px}$). Committed descending swing driving the massive clapper staff downward. Head apex $[320, 180]$, amber core $[340, 330]$, clapper head $[680, 240]$.
5. `contact` (col 1, row 1): duration $0.45\text{s}$, local bounds $[104, 229]$ to $[707, 705]$ ($604 \times 477\text{px}$). Full ground impact slamming the bronze clapper head into the floor. Head apex $[310, 240]$, amber core $[320, 380]$, clapper head $[695, 680]$.
6. `recover` (col 2, row 1): duration $1.30\text{s}$, local bounds $[123, 244]$ to $[560, 705]$ ($438 \times 462\text{px}$). Heavy committed follow-through; vulnerable recovery window for hero counter-attack. Head apex $[290, 260]$, amber core $[280, 390]$, clapper head $[540, 680]$.

## Combat Tuning Targets (M4.5 Contract Proposal)
- **HP**: 12 hits to defeat (boss encounter)
- **Damage**: 1 heart per slam contact
- **Movement**: Grounded arena presence
- **Overhead Warning**: $1.20\text{s}$ telegraphed tell
- **Slam Duration**: $0.35\text{s}$ committed strike
- **Punishable Recovery**: $1.30\text{s}$ recovery window
