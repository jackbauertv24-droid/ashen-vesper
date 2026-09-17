# Consecration Ember Native-Alpha Cutout Candidate v001

- Generation attempts: **2**, using the built-in `image_gen` tool.
  - Attempt 1: Produced detailed bell and flame but painted transparency over a baked gray checkerboard (#9e9e9e / #cfcfcf). Translucent flame halo retained visible checkerboard squares.
  - Attempt 2 (Correction): Explicitly specified a pure solid flat black studio background (`RGB 0, 0, 0`) with zero checkerboard or grid. Generated flawless compact amber flame and aged-bronze bell fragment with sharp runes and Gothic relief.
- Reference: `art/production/props/consecration-ember-v001.png`.
- Provider model identifier, metered tokens, quota debit and monetary cost were unmetered/not exposed by the execution environment; recorded as unknown.
- Original generator output: `source/ember-alpha-generated-v001.png` (1024 × 1024 PNG, SHA-256: `58fd3cfdfcd8be9b6f541ab0601e00f10885c0c3014f440331565db622527f21`).
- Exported production cutout: `exports/ember-alpha-v001.png` (1024 × 1024 RGBA PNG, color type 6, SHA-256: `adfc9f4a74de7467a55a334aa8e56f380daf2776f3dcdc341ec85ac2eb89f10b`).
- Geometry & bounds:
  - Canvas dimensions: 1024 × 1024.
  - Shared pivot anchor: `(512, 550)`.
  - Visible bell and flame bounds: x = 323..687 (width 365), y = 191..744 (height 554), centered at (511.8, 522.9), fully inside the requested x=256..768, y=160..864 envelope.
  - Outer 32px border padding: strictly alpha zero across all boundary pixels (no stray glow or edge clipping).
  - Runtime display size: 54 × 54 units; pickup collision radius 22 units.
- Normal source-over compositing verified:
  - Composited without screen blending or color keying against black (`#05080f`), white (`#ffffff`), saturated blue (`#1d4ed8`), and the actual abbey masonry/skyline in `docs/reviews/ember-alpha-v001.png`.
  - No dark fringe, no rectangular veil, and no loss of cool bronze metal engravings or warm fire luminescence.
- Interactive verification: Standalone review page available at `art/contributions/05-ember-alpha/v001/preview.html`.
- **Status:** Submitted as `candidate` for maintainer review. Engine integration is left to the repository owner to preserve project direction.
