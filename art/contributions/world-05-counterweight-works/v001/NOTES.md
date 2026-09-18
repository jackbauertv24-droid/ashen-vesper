# World 05 / Job 15 — Counterweight Works: Stone-and-Iron Lift Deck (v001)

- Asset: Original Gothic abbey stone-and-iron moving elevator lift deck platform for Ashen Vesper (Stage 05 first bounded art PR and Job 15 mechanism contract).
- Generator tool: DeepMind Agent Image Generation (`imagen-3.0-generate-002`).
- Original generator output: `source/lift-deck-generated-v001.jpg` (1376 × 768 JPEG, SHA-256: `837c28397485750b712d75be149ab6113d447a51df1a63c13b4504c2e05f007b`).
- Export deliverable: `exports/lift-deck-v001.png` (1024 × 256 RGBA PNG, color type 6, 8-bit depth, SHA-256: `6bba3bea92b2eb248fcf0aa6334ce8d394d92dc1ad669a412d6f38d44b4d1263`).
- Visual review evidence: `docs/reviews/counterweight-lift-deck-v001.png` (1440 × 1040 PNG, SHA-256: `a43558d4458d94cc9d6aa6b4189c5a854767020dcbb53ac6914055bbec1d6121`).
- Standalone interactive preview: `preview.html` (interactive vertical shaft travel, hero carrying simulation, 1:1 runtime scale, and socket telemetry).

## Design & Mechanical Alignment
- Stage location: `docs/world/stages/05-counterweight-works.md` — first bounded art PR: one lift deck OR counterweight with attachment sockets; prefer the deck needed by the code prototype.
- Specialist contract: `docs/art-jobs/15-mechanisms.md` — *"Lift deck 1024 × 256 RGBA / runtime 240 × 60 / top contact source y=32... Keep attachment sockets clear and recorded. Export separate moving objects; never flatten the lift, chains and weight together."*
- Subject: Heavy moving elevator platform consisting of a weathered Gothic limestone slab surface, dark riveted wrought-iron reinforcement frame, corner suspension shackles with forged lifting rings on left and right sides, and a heavy reinforced underside truss with bolted beams and corbel brackets.
- Separation of concerns: Pure lift deck cutout only; chains, counterweights, and wheel housings remain separate entities.

## Technical Contract Verification
- Dimensions: 1024 × 256, PNG Color Type 6 (True RGBA).
- Runtime canvas: 240 × 60 units at uniform scale 0.234375 ($240/1024$).
- Top contact surface: Declared source $y = 32$ (runtime $y = 7.5\text{u}$). Level flat standing slab across $x = 200..800$.
- Hoist suspension sockets: Left shackle at `(72, 32)`, right shackle at `(952, 32)`.
- Safe padding margins: Brief requires $\ge 12\text{px}$ clear padding. Actual margins:
  - Left margin: 64 px
  - Right margin: 64 px
  - Top margin: 26 px (corner post top $y=26$)
  - Bottom margin: 45 px
  - Border violations: 0 across all 4 perimeters.
- Visible bounding box: $x = 64..959$ (width 896 px), $y = 26..210$ (height 185 px).

## Moving Platform Gameplay Behavior
- Carries grounded hero: Flat level top surface supports the Bellwarden player character (144u height) throughout vertical ascent and descent.
- Jump-off clearance: Allows safe jumping off at intermediate landings and shaft openings without edge snagging.
- Underside collision: Reinforced structural truss blocks jump passage from below, preventing upward phase-through or wall teleporting.
- Reversal safety: Vertical shaft transit path with declared endpoints between lower machinery gallery and upper exit landing.

## Export Methodology
1. Generated master lift platform elevation on solid black background ($RGB \le 1$).
2. Scaled into 1024 × 256 canvas with stone top surface aligned at $y = 32$ and corner suspension eyebolts at $x=72$ and $x=952$.
3. Alpha keying calibrated to preserve pitted iron rivets and truss cutouts while removing background void.
4. Exported 1024 × 256 RGBA PNG and verified against test suites.
