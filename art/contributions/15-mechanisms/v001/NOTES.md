# Job 15 — Mechanisms: Abbey Lever (v001)

- Asset: Original Gothic abbey mechanism lever two-state animation sheet for Ashen Vesper.
- Generator tool: DeepMind Agent Image Generation (`imagen-3.0-generate-002`).
- Generation attempts: 2 attempts generated and recorded (monolithic two-state prompt test, then isolated master assembly).
- Original generator output: `source/lever-generated-v001.png` (1024 × 1024 PNG, SHA-256: `e51a4533e4c94ffb73ddc674e3bc0b7faba1fa30a1d4bcb7999325d25058a4da`).
- Export deliverable: `exports/lever-v001.png` (1024 × 512 RGBA PNG, color type 6, SHA-256: `6a31f11eb267355e7d99f7a1651d6a89e1361d884847c99f5947994d2ed92c53`).
- Visual review evidence: `docs/reviews/abbey-lever-v001.png` (1400 × 950 PNG, SHA-256: `301f66801ea63ff89315ce1ed3b1bca0612d97cd5373f877131b5436aba6ae41`).
- Quota / Cost: Standard AI Agent generation quota; exact monetary cost unknown.

## Design and Style Alignment
- Subject: Worn abbey lever mechanism featuring a carved limestone plinth base, cast-iron toothed ratchet gear housing, central iron hub with axle bolt, and an aged-brass handle with counterweight knob.
- Materials: Weathered Gothic limestone and pitted dark iron directly matching the retain masonry module and portcullis gate; aged brass matching the Bellwarden's metal equipment fittings and the Job 14 healing vial filigree.
- States:
  - `inactive` (Cell 0): Lever handle angled upward (~45° elevation).
  - `active` (Cell 1): Lever handle pulled forward-downward (~-31° depression, total rotation +76° around axle hinge).
- Readability: Clear silhouette distinction between upright disengaged posture and lowered engaged posture across high-contrast value testing.

## Technical Contract Verification
- Dimensions: 1024 × 512, PNG Color Type 6 (True RGBA).
- Cells: Two 512 × 512 cells side-by-side:
  - Cell 0 (x=0..511, y=0..511): Inactive state
  - Cell 1 (x=512..1023, y=0..511): Active state
- Cell padding: 12px requirement. Actual minimum margin is > 30px on all 4 cell borders (0 border alpha violations).
- Ground Pivot: Declared local `(256, 464)`. Bottom surface of the limestone plinth aligns precisely with `y=464`.
- Hinge Point: Declared local `(256, 280)`. Axle center aligns precisely at `(256, 280)`.
- Zero Base Jitter: The limestone plinth and cast-iron gear housing are bit-for-bit identical between both cells (0.00 px base drift), fulfilling the brief contract: *"Handle rotates around that hinge; base never shifts."*
- Runtime scale: Cell 64 × 64 units, plinth ground at `y=58`, hinge at `y=35`. Waist-height reach for the Bellwarden hero (144u height).

## Export Methodology
1. Generated master abbey lever asset with orthographic side view and clean contrast against pure background.
2. Segmented the master assembly into the stationary base (limestone plinth, outer gear housing, and central axle bolt) and the articulated brass handle.
3. Completed the unoccluded gear quadrant behind the handle by mirroring symmetrical unoccluded housing geometry.
4. Composited Cell 0 with the handle in the inactive upper position (~45°).
5. Rotated the handle by +76° around the exact pivot `(256, 280)` and composited onto the identical base for Cell 1 (active state).
6. Exported 1024 × 512 RGBA PNG with genuine alpha transparency.

## Acceptance & Engine Status
- Status: `candidate`
- Interaction code ([E] trigger, proximity check, and gate linkage) is pending maintainer integration in the Ruined Cloister expansion.
