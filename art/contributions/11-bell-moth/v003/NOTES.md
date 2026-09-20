# Job 11 — Bell Moth: 6-Pose Motion Sheet Candidate (v003)

## Overview & Context
- **Job ID**: `11-bell-moth`
- **Version**: `v003`
- **Status**: `candidate` (motion sheet)
- **Direct Response to Maintainer Milestone**: Directly fulfills Milestone M1.5 in `docs/NEXT_MILESTONES.md`:
  > *"M1.5 Bell Moth motion and AI (art then code, P1): reuse selected reference; produce the documented motion sheet, then telegraphed swoop/two-hit behavior. No new design reference."*

## Technical Specifications
- **Raw Generator Source**: `art/contributions/11-bell-moth/v003/source/bell-moth-motion-generated-v001.jpg`
  - Format: 1264 × 848 JPEG
  - SHA-256: `05996f1140a111170e83b031d1eede970d7d1aa0c1ba942ee34b0a4af8b346ba`
- **Export Cutout Sheet**: `art/contributions/11-bell-moth/v003/exports/bell-moth-motion-v001.png`
  - Format: 1536 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha channel)
  - SHA-256: `7720f558a7c56823dd3e0ee211a30b1947d36aed058a0163fa93e355a6e9660b`
- **Review Composite**: `docs/reviews/bell-moth-motion-v001.png`
  - Format: 1536 × 1120 PNG
  - SHA-256: `5b1bc9d4dea342449dd16430ba5dff3a3b69aa84b9e342cd56045a34fafdedb8`

## Sheet Grid & Frame Definitions
- **Grid Layout**: 3 columns × 2 rows of fixed $512 	imes 512$ px cells
- **Shared Body Anchor**: Local `[256, 256]` inside every cell
- **Nominal Wingspan**: ~320–330 px across hover frames
- **Runtime Wingspan**: **64 game units** (uniform scale $0.2$)
- **Frame Manifest**:
  1. `hover-high` (col 0, row 0): bounds $[101, 94]$ to $[430, 432]$, wings raised high in neutral hover
  2. `hover-low` (col 1, row 0): bounds $[93, 161]$ to $[422, 382]$, wings down low in neutral hover
  3. `warn` (col 2, row 0): bounds $[97, 121]$ to $[375, 419]$, wings drawn back, glowing amber attack tell
  4. `swoop-start` (col 0, row 1): bounds $[147, 104]$ to $[371, 427]$, downward diagonal commitment dive
  5. `swoop-contact` (col 1, row 1): bounds $[123, 130]$ to $[397, 371]$, horizontal strike pose with trailing bell
  6. `climb` (col 2, row 1): bounds $[126, 104]$ to $[374, 435]$, ascending recovery climb back to hover altitude
- **Cell Padding**: Every cell strictly enforces $ge 12$ px outer margin (measured minimum is $76$ px, 0 boundary violations)
