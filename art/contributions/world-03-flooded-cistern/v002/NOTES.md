# World 03: Flooded Cistern — Seamless Damp Platform Kit (v002)

## Overview & Purpose
This versioned contribution directly resolves the maintainer review in PR #23 (`docs/PR_22_28_REVIEW.md`):
> *"retained Cistern material candidate. Decorative end corbels repeat at every join, so the submitted three-copy image does not establish a production seam. Make a central repeat strip plus separate end caps before runtime selection."*

### Problems Resolved from v001
1. **Baked-In End Corbels**: In `v001`, decorative corbels were baked into the lateral edges of `damp-platform-cap-v001.png`, causing corbel repetition at every multi-copy join.
2. **Modular Kit Separation**: In `v002`, the platform is decoupled into a dedicated, mathematically seamless 1024×256 center repeat strip, plus separate 256×256 left and right decorative end corbels sharing the exact dark damp slate and mossy seepage palette.
3. **Seam Invariance**: Column 0 and Column 1023 of the center repeat strip connect with exact zero-delta continuity ($\Delta = 0$). End caps interlock with the center strip with zero boundary delta.

## Technical Specifications
- **Raw Generator Sources**:
  - `source/cistern-platform-strip-generated-v001.jpg`: 1264 × 848 JPEG (SHA-256: `4f830911e4433348af00616fa4e07c5ea40e01b760d377d2dd42ea9f4f37d96f`)
  - `source/cistern-cap-corbel-generated-v001.jpg`: 1024 × 1024 JPEG (SHA-256: `560d38fcab140f2ee9314d75f0bc0d5d9a1dd772686dd58d70de7dbe9bac7ead`)
- **Export 1 (Seamless Center Strip)**: `exports/damp-platform-cap-center-v002.png`
  - Dimensions: 1024 × 256 RGBA (Color Type 6)
  - SHA-256: `ed2bc3ce7f3195f245330984416b588da876d707fcc13ddf829eaaafff4bfdde`
  - Repeat Interval: 1024 px (240 runtime units at uniform 0.234375 scale)
  - Seam Delta: $\Delta = 0$ across all 183 vertical lines
- **Export 2 (Left End Cap)**: `exports/damp-platform-cap-end-left-v002.png`
  - Dimensions: 256 × 256 RGBA (Color Type 6)
  - SHA-256: `7dd07076fef8fb46162ee41400d115bf17b74144eb420135367df1bdbb552aa8`
  - Visible Bounds: $x = 65..255$, $y = 32..214$ (width 191px, height 183px)
  - Margins: Left margin 65px ($\ge 32$px), top 32px, bottom 41px
  - Right socket column ($x = 255$) connects to center strip column 0 with $\Delta = 0$
- **Export 3 (Right End Cap)**: `exports/damp-platform-cap-end-right-v002.png`
  - Dimensions: 256 × 256 RGBA (Color Type 6)
  - SHA-256: `964c236a3b0933a5322fe506849813c7fc17398692270ccf40f8ee720cdb8031`
  - Visible Bounds: $x = 0..190$, $y = 32..214$ (width 191px, height 183px)
  - Margins: Right margin 65px ($\ge 32$px), top 32px, bottom 41px
  - Left socket column ($x = 0$) connects to center strip column 1023 with $\Delta = 0$
- **Review Composite**: `docs/reviews/cistern-damp-platform-seamless-v002.png`
  - Dimensions: 1680 × 1260 PNG
  - SHA-256: `cdb80b40799b33112ebcf510cba13ad30669cf573cf2cdb673ca958f27a4723a` (verified)
  - Features: Multi-background seam proofs, 32x difference amplification, complete assembly, and in-situ Flooded Cistern multi-bay runway composition with Bellwarden scale reference.
