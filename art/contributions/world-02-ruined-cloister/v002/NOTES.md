# World 02: Ruined Cloister — Seamless Walkable Platform Kit (v002)

## Overview & Purpose
This contribution directly fulfills **Milestone M1.6** and the **Job 08 Seamless Platform Strip** specification (`docs/art-jobs/08-ruined-cloister.md`, `docs/NEXT_MILESTONES.md`), resolving the architectural defect that led to the withdrawal of `v001` in commit `aa6bcc8`.

### Problems Resolved from v001
1. **Directional Lighting Shift**: In `v001`, a lighting gradient from left (cool blue, $R \approx 103, B \approx 130$) to right (warm yellow, $R \approx 180, B \approx 146$) caused severe visible vertical bands whenever copies were repeated edge-to-edge.
2. **Baked-In End Corbel Geometry**: In `v001`, tapered decorative corbels were baked into the horizontal edges ($x=64..256$ and $x=768..960$), preventing natural straight floor repetition across multi-bay platforms.
3. **Modular Kit Separation**: In `v002`, the center walkable strip is decoupled into a dedicated, mathematically seamless 1024×256 center module, accompanied by separate 256×256 decorative left and right end caps sharing the identical cool blue-gray limestone palette and cross-section profile.

---

## Technical Specifications
- **Raw Generator Output**: `art/contributions/world-02-ruined-cloister/v002/source/cloister-platform-strip-generated-v001.jpg`
  - Dimensions: 1472 × 640 JPEG
  - SHA-256: `792c3687254a0421113f7f2b6a250ddc3f53c29137554d4f61b5b96c5948ef83`
  - Generated via Google Imagen 3 (prompt logged in `PROMPT.txt`).
- **Export 1 (Seamless Center Strip)**: `art/contributions/world-02-ruined-cloister/v002/exports/platform-cap-center-v002.png`
  - Dimensions: 1024 × 256 RGBA PNG (Color Type 6, 8-bit depth)
  - SHA-256: `defc94087e00370c8cddd700e07d429ad2b1128d703a0b020d996bbafb98861a`
  - Repeat Interval: 1024 px (240 runtime units at uniform 240/1024 scale)
- **Export 2 (Left End Cap)**: `art/contributions/world-02-ruined-cloister/v002/exports/platform-cap-end-left-v002.png`
  - Dimensions: 256 × 256 RGBA PNG (Color Type 6, 8-bit depth)
  - SHA-256: `537e941fd5c56db9e5c53523d60bd56a38df61f8280973bfe62155a487b0ce1b`
  - Visible Bounds: $x = 64..255$, $y = 32..214$ (width 192px, height 183px)
- **Export 3 (Right End Cap)**: `art/contributions/world-02-ruined-cloister/v002/exports/platform-cap-end-right-v002.png`
  - Dimensions: 256 × 256 RGBA PNG (Color Type 6, 8-bit depth)
  - SHA-256: `c9543af5aae4ce77f89fbe0958488988225ceb065f1354edc222a1b58fdd7ea2`
  - Visible Bounds: $x = 0..191$, $y = 32..214$ (width 192px, height 183px)
- **Review Composite**: `docs/reviews/platform-cap-seamless-v002.png`
  - Dimensions: 1680 × 1260 PNG
  - SHA-256: `c54d6fb69969237225c86f786a5724dbfc3ddcec08e04d442b869302b939e6f2`

---

## Seam Continuity & Mathematical Verification
1. **Horizontal Tiling Invariance**:
   - Column 0 and Column 1023 of `platform-cap-center-v002.png` were calibrated and verified across all 256 vertical scanlines.
   - Measured boundary difference:
     $$\max_{y \in [0, 255]} |P(0, y) - P(1023, y)| = (\Delta R = 0, \Delta G = 0, \Delta B = 0, \Delta A = 0)$$
2. **End-Cap Interlocking**:
   - Left End rightmost column ($x = 255$) connects to Center Strip leftmost column ($x = 0$) with $\Delta = 0$.
   - Center Strip rightmost column ($x = 1023$) connects to Right End leftmost column ($x = 0$) with $\Delta = 0$.
3. **Lossless Multi-Background Review (`docs/reviews/platform-cap-seamless-v002.png`)**:
   - **Row 1**: Three-copy center run over Pure White (`#ffffff`), demonstrating zero silhouette fringing or dark halos.
   - **Row 2**: Three-copy center run over Cloister Midnight Blue (`#141624`), matching the in-game lighting environment.
   - **Row 3**: Three-copy center run over Pure Black (`#000000`), confirming absolute edge opacity and light value continuity.
   - **Row 4**: Three-copy center run converted to ITU-R BT.709 Grayscale, certifying equal luminance distribution with zero contrast boundary lines.
   - **Row 5**: Full platform assembly (Left End + Center Strip + Right End) with Bellwarden hero standing at true runtime contact.
   - **Row 6**: Amplified Seam Difference Proof ($32\times$ difference amplification), displaying flat solid black across the seam columns.

---

## Geometry & Contract Alignment
- **Top Walking Surface**:
  - Strictly planar at source $y = 32$ ($y = 7.5$ runtime units).
  - Zero vertical waviness or bevel drops across the full 1024px center strip.
- **Slab Thickness**:
  - Vertical masonry span: $y = 32..214$ (height 183px = 42.9 runtime units).
  - Margin clearances: Top margin 32px ($\ge 16$px), bottom margin 41px ($\ge 32$px).
- **Scale & Runtime Integration**:
  - Nominal canvas: 240 × 60 runtime units at scale $240 / 1024 = 0.234375$.
  - Sockets:
    - Center Left: $(0, 32)$ source $\rightarrow$ $(0, 7.5)$ runtime.
    - Center Right: $(1024, 32)$ source $\rightarrow$ $(240, 7.5)$ runtime.
    - Left End Terminal Contact: $(64, 32)$ source $\rightarrow$ $(15, 7.5)$ runtime; Inner Socket: $(256, 32)$.
    - Right End Inner Socket: $(0, 32)$; Terminal Contact: $(192, 32)$ source $\rightarrow$ $(45, 7.5)$ runtime.
