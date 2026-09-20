# Job 16 — Tollkeeper Boss: Corrected Two-Handed Design Reference (v002)

## Overview & Context
- **Job ID**: `16-tollkeeper`
- **Version**: `v002`
- **Status**: `candidate` (design reference)
- **Direct Response to Maintainer Review**: Resolves the explicit feedback from maintainer review in `docs/PR_22_28_REVIEW.md` and `docs/NEXT_MILESTONES.md` (Milestone M4.5):
  > *"M4.5 Tollkeeper: corrected two-handed design reference, motion, then boss AI/arena. Do not animate current one-handed candidate."*
  > *"PR 18 candidate is retained. Two-handed pose and true 220-unit runtime preview require correction before motion selection."*

## Technical Specifications
- **Raw Generator Source**: `art/contributions/16-tollkeeper/v002/source/tollkeeper-twohanded-generated-v002.jpg`
  - Format: 1024 × 1024 JPEG
  - SHA-256: `b3ea8a1aa208f6406cd87a020faf34ebbb6e568ad78b5dab420ff7f896079f38`
- **Export Cutout**: `art/contributions/16-tollkeeper/v002/exports/tollkeeper-twohanded-v002.png`
  - Format: 1024 × 1024 RGBA PNG (Color Type 6, 8-bit truecolor with alpha channel)
  - SHA-256: `dfc3d200106a508492d23c15b4ccee795061a0c5f230adaab1872b76f5cef536`
- **Review Composite**: `docs/reviews/tollkeeper-twohanded-v002.png`
  - Format: 1440 × 1040 PNG
  - SHA-256: `afaa9fd0383524d19543a483caaef7f04ae78690a3af9761c1ff58e3c890fb12`

## Geometry, Bounds & Margins
- **Visible Bounds**:
  - Horizontal: $x = 134..889$ (width: 756 px)
  - Vertical: $y = 50..959$ (height: 910 px)
- **Safety Margins**:
  - Left: 134 px
  - Right: 134 px (exact horizontal balance, centered at $x = 511.5$)
  - Top: 50 px ($> 32$ px)
  - Bottom: 64 px ($> 32$ px)
  - Border violations: **0** (strictly clears the 32 px boundary contract)
- **Stature & Combat Scale**:
  - Standing Height: 910 source pixels
  - Nominal Runtime Height: **220 game units** (strictly conforms to `docs/art-jobs/16-tollkeeper.md`)
  - Scale Factor: $220 / 910 approx 0.241758$
  - Ground Pivot: Source `[512, 960]` (resting at the boot footing line); Runtime: `[123.8, 232.1]`

## Pose & Anatomy Corrections
1. **Two-Handed Grip**: Both hands maintain an active, authentic grip on the weapon handle (right hand forward near the collar, left hand braced lower on the shaft).
2. **Staff Silhouette**: Massive cast-bronze bell clapper head angled upward and forward ready for a downward slam arc.
3. **Anatomy & Vestments**: Gaunt aged cowl, cracked bronze shoulder collar harness, tattered ash-indigo robes, and iron-plated boots.
4. **Amber Chest Core**: Embedded reliquary landmark identified at $(470, 341)$ with solid opacity ($A = 255$).
5. **Pierced Transparency**: Clear open space between the arms and staff handle ($A = 0$), preventing any solid matte blocking.
