# Job 05 — native-alpha ember pickup

Priority: highest remaining prop task. Reference art/production/props/consecration-ember-v001.png. Preserve the original. Runtime matte separation is provisional and can lose cool metal detail.

Update: PR 12's native-alpha export is now integrated, replacing the provisional separation. This job becomes a follow-up polish/retention task; see docs/PR_12_REVIEW.md. Preserve v001, add the missing rejected first generation if available, and submit edge improvements as versioned derivatives.

## Copyable prompt

> Create a production cutout of Ashen Vesper's original Consecration Ember matching the supplied pickup: a small broken aged-bronze bell fragment surrounded by compact amber flame, engraved Gothic metal, HD painted non-pixel art. Fixed orthographic view, centered at (512,550) on 1024 × 1024. Preserve engraved dark metal instead of erasing it. Actual RGBA transparency: empty exterior fully clear. No blue/black studio backdrop, painted checkerboard, floor, cast shadow, text, vignette or rectangular glow wash. Bell and flame inside x=256..768, y=160..864. No loose particles outside those bounds. Compact flame edges may be translucent; wide bloom belongs in a separate effect. Match the brazier's brass and fire. Prioritize a readable bell silhouette at small gameplay size.

## Contract

One 1024 × 1024 RGBA cutout, pivot (512,550), visible bounds recorded. Runtime canvas 54 × 54, visible bell/flame about 27 × 37 units. Preserve current falling physics and pickup radius 22. Submit untouched source plus versioned cleaned export, machine-readable dimensions/pivot/display bounds/SHA-256, exact prompt, attempt count, known model and limitations under art/contributions/05-ember-alpha/v001/.

## Tests

- PNG color type 6. All pixels in the outer 32px border must have alpha zero. Empty space must be clear, not translucent blue.
- Normal source-over composites against black, white, saturated blue and actual abbey sky/masonry, at source and runtime scale. No screen blending needed to hide a backdrop.
- Show moving over two background regions, engraved metal, antialias edges and flame edges; no box or veil.
- In-game: break brazier, watch pickup fall/settle, collect it, spend one at the gate. Exactly one ember drops; visual disappears immediately on collection.
- Run npm test, npm run test:encounter, npm run validate:assets and npm run test:browser after catalog updates. State whether integration is complete.

The character-sheet validator does not support this single-prop job. Supply alpha evidence and general resource checks; RGBA alone does not establish visual acceptance.
