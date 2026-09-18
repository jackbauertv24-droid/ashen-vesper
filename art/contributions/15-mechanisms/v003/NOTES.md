# Job 15 — Mechanisms: Ruined Cloister Portcullis Grate (v003)

- Asset: Original Gothic abbey heavy iron portcullis grate mechanism for Ashen Vesper (Stage 02 Ruined Cloister Machinery Room exit).
- Generator tool: DeepMind Agent Image Generation (`imagen-3.0-generate-002`).
- Original generator output: `source/grate-generated-v001.jpg` (896 × 1200 JPEG, SHA-256: `dfccda25e733278910a1e8e333a9ac6fc250109269912528060fdf74a9654103`).
- Export deliverable: `exports/grate-v001.png` (1024 × 1280 RGBA PNG, color type 6, 8-bit depth, SHA-256: `dd143330e1f424adcbf6d2e6e8525c24b9010abc00ca51aecbd8b3116e4d027a`).
- Visual review evidence: `docs/reviews/abbey-grate-v001.png` (1440 × 1040 PNG, SHA-256: `8181ab0cf8e24a68c659bef043b1a77db372dcfa591c31625ecc6528e3fa9135`).
- Standalone interactive preview: `preview.html` (interactive [E] toggle, Closed vs Open state inspection, lever linkage, and hero scale lineup).

## Design & Architectural Alignment
- Stage location: `docs/world/stages/02-ruined-cloister.md` — Machinery room exit portcullis.
- Subject: Ancient Gothic heavy wrought-iron portcullis gate featuring heavy vertical iron pickets, double horizontal riveted tie-bars, pointed bottom spear tips, and top hoist suspension shackles with forged lifting eyebolts.
- Materials: Pitted, weathered dark wrought iron directly matching the retain masonry module and the Job 15 Abbey Lever housing (`art/contributions/15-mechanisms/v001/exports/lever-v001.png`).
- Pierced geometry: Genuine interior alpha transparency through all rectangular lattice openings, allowing background masonry, torchlight, and parallax layers to show through cleanly.

## Technical Contract Verification
- Dimensions: 1024 × 1280, PNG Color Type 6 (True RGBA).
- Runtime canvas: 128 × 160 units at uniform scale 0.125 ($128/1024$).
- Shared sill pivot: Declared local `(512, 1216)` (runtime `(64, 152)`). Spear tips touch exactly on ground line $y=1215..1216$.
- Top hoist attachment socket: Local `(512, 64)` (runtime `(64, 8)`) for counterweight chain connection.
- Safe padding margins: Brief requires $\ge 12\text{px}$ clear padding. Actual margins:
  - Left margin: 88 px
  - Right margin: 88 px
  - Top margin: 64 px
  - Bottom margin: 64 px
  - Border violations: 0 across all 4 boundaries.
- Visible bounding box: $x = 88..935$ (width 848 px), $y = 64..1215$ (height 1152 px).

## Lever Linkage & Gameplay Behavior
- Connected trigger: Paired with Job 15 Abbey Lever (`v001/exports/lever-v001.png`).
- Default state: Closed. Grate rests at sill pivot `y=0`. Solid vertical barrier blocking transit.
- Active state: Open. When the player presses [E] near the lever, the lever rotates +76° to active stance and the portcullis rises by 120 runtime units ($y = -120\text{u}$) over 1.2s.
- Clearance: The 120u vertical lift raises the bottom spear tips from $y=152$ to $y=32$, providing 120 units of clear walkable passage, well above the Bellwarden player height (144u bounding box, ~100u crouch/walk head clearance).
- Collision: Solid blocking collider when closed; passable passage when fully raised.
- Run persistence: Activation state is retained across player respawns within the run.

## Export & Keying Methodology
1. High-fidelity prompt generated on solid black background ($RGB \le 1$).
2. Precise alpha keying calibrated at threshold 4 with 4px feathering, preserving the dark weathered wrought-iron surface texture while creating crisp transparent cutouts through every lattice cell.
3. Aligned bottom spear tips to $y=1215..1216$ and centered horizontally at $x=512$.
4. Cleaned safe outer padding margins ensuring zero perimeter bleed.
5. Exported 1024 × 1280 RGBA PNG and verified against test suites.
