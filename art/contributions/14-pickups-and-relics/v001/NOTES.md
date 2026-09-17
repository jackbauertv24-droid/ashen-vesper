# Job 14 — Useful Pickups: Healing Vial (v001)

- Asset: Original Gothic healing vial pickup candidate for Ashen Vesper.
- Generator tool: DeepMind Agent Image Generation (`imagen-3.0-generate-002`).
- Generation attempts: 1 attempt generated and recorded.
- Original generator output: `source/healing-vial-generated-v001.png` (1024 × 1024 PNG, SHA-256: `c954cdf6f90404f0d3cc6599b0dc286588b7a4d063c854b13570f54ba0c9d2f6`).
- Export deliverable: `exports/healing-vial-v001.png` (1024 × 1024 RGBA PNG, color type 6, SHA-256: `da39fae9452fcb684df2f81ff7f861db6c80707f29a0c22f756972881885724c`).
- Visual review evidence: `docs/reviews/healing-vial-v001.png` (1400 × 950 PNG, SHA-256: `46b2e0fafbe0f9b34c875d7271378337a453bb689010341c0a82efdfba03c690`).
- Quota / Cost: Standard AI Agent generation quota; exact monetary cost unknown.

## Design and Style Alignment
- Subject: Small aged-brass filigree cage encasing deep dark red glass containing healing cordial, sealed with a worn ivory stopper bound in leather cord.
- Materials: Aged weathered brass and worn ivory matching hero belt fixtures and holy bronze embers.
- Contrast & Readability: Compact, distinct upright flask silhouette; easily distinguished from the flaming consecrated ember and rock debris both in color and in grayscale.

## Technical Contract Verification
- Dimensions: 1024 × 1024, PNG Color Type 6 (True RGBA).
- Outer 32px perimeter alpha: Exactly 0 across all 126,976 perimeter pixels (0 violations).
- Measured visible envelope: `minX=377, maxX=646, minY=212, maxY=767` (270 × 556 px).
  - Strictly within brief bounds: `x=256..768, y=192..832`.
- Pivot: Declared `[512, 768]`. Flask base touches ground anchor at `y=767`, horizontally centered at `x=511.5`.
- Runtime scale: 48 × 48 canvas, pivot `(24, 36)`.

## Export Methodology
1. Generator produced an isolated high-contrast render on pure black background with generous margins.
2. Background identified using 4-edge connected flood-fill (`max(R,G,B) <= 7`), preserving the interior rich ruby glass and liquid at 100% opacity without false transparency.
3. Edge boundary anti-aliased with unmultiplied color preservation to eliminate haloing and dark fringing.
4. Placed on exact 1024 × 1024 canvas with base aligned to declared pivot `(512, 768)`.

## Acceptance & Engine Status
- Status: `candidate`
- Inventory and consumption mechanics are pending runtime implementation in the Ruined Cloister expansion.
