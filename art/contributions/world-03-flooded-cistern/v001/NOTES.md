# World 03 — Flooded Cistern: Walkable Damp Platform Cap (v001)

- Asset: Original Gothic Flooded Cistern walkable damp slate platform and landing cap module for Ashen Vesper (Stage 03 first bounded art PR).
- Generator tool: DeepMind Agent Image Generation (`imagen-3.0-generate-002`).
- Original generator output: `source/damp-platform-cap-generated-v001.jpg` (1376 × 768 JPEG, SHA-256: `8386007695fae7e3c4a9c1e9f07d1aaec2394d86dd182ebd4c8766df08f3e3e0`).
- Export deliverable: `exports/damp-platform-cap-v001.png` (1024 × 256 RGBA PNG, color type 6, 8-bit depth, SHA-256: `c59fc284b70bfb032a28355ae418bd718adff138b23030c43f23452ddce4146c`).
- Visual review evidence: `docs/reviews/cistern-damp-cap-v001.png` (1440 × 1040 PNG, SHA-256: `2d5381941a7aa9b5a1ab91f6bcf14c0d59747920e0cb7918264d4d3834aa9e77`).
- Standalone interactive preview: `preview.html` (single module, three-copy continuous run, cistern dark water/vault setting, hero scale lineup, and sockets/bounds overlays).

## Design & Architectural Alignment
- Stage location: `docs/world/stages/03-flooded-cistern.md` — first bounded art PR: one damp platform cap with three-copy seam evidence.
- Subject: Wet, weathered dark slate walkable platform cap with carved Gothic cornice, cold cyan moss highlights, dripping underside stalactites, and oxidized bronze structural brackets.
- Palette & Mood: Cold blue-gray, muted teal/cyan moss, and dark damp slate tones matching the Flooded Cistern brief and the selected Cistern Lurker enemy reference (`art/contributions/13-cistern-lurker/v001/exports/cistern-lurker-v001.png`).
- Walkable upper surface: Perfectly flat horizontal walking plane at $y = 32$ with solid continuous support across the central span.

## Technical Contract Verification
- Dimensions: 1024 × 256, PNG Color Type 6 (True RGBA).
- Runtime canvas: 240 × 60 units at uniform scale 0.234375 ($240/1024$).
- Painted top source: $y = 32$ (runtime $y = 7.5\text{u}$).
- Sockets: Declared at `(64, 32)` and `(960, 32)`.
- Repeat interval: Exactly 896 px ($960 - 64$), corresponding to 210 runtime units at uniform scale 0.234375.
- Safe padding margins: Brief requires $\ge 16\text{px}$ clear padding. Actual margins:
  - Left margin: 64 px
  - Right margin: 64 px
  - Top margin: 32 px
  - Bottom margin: 41 px
  - Border violations: 0 across 16px and 32px perimeters.
- Visible bounding box: $x = 64..959$ (width 896 px), $y = 32..214$ (height 183 px).

## Repeating Platform Behavior
- Three-copy continuous run verified with 896px repeat offset ($x_0 = 0$, $x_1 = 896$, $x_2 = 1792$).
- Walkable top plane maintains uninterrupted level contact across consecutive modules.
- Runtime crop compatibility: Consistent with the maintainer floor slicing strategy established in `docs/PR_18_21_REVIEW.md`.

## Export & Keying Methodology
1. High-fidelity prompt generated on pure black background ($RGB \le 1$).
2. Scaled and placed into exact 1024 × 256 canvas with painted top at $y = 32$ and span 896px ($x = 64..959$).
3. Alpha keying calibrated to preserve wet flagstone specular sheen and dripping stalactites while cleanly removing black outer void.
4. Exported 1024 × 256 RGBA PNG and verified against test suites.
