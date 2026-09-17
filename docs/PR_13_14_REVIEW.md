# PR 13 and PR 14 review

## PR 13 — healing vial

Decision: retain and select the export as the **prototype pickup asset**, pending inventory/use behavior. Distinct red glass, aged brass and ivory stopper fit the Cloister palette and read separately from the flaming ember. The export is RGBA, all outer 32px pixels are transparent, and visible bounds match the documented envelope. Glass/liquid are intentionally opaque in this prototype; physical glass refraction is not implied.

The 48px display canvas gives the actual vial a roughly 13 × 26px silhouette, which is readable but small on mobile. Keep this declared scale for the initial integration preview; any later enlargement must update metadata and compare against the ember and hero. A use/inventory icon may need a separate simple derivative.

Source, export, exact prompt, notes, metadata, preview and evidence are preserved. Contributor records one generation using imagen-3.0-generate-002; this is reported provenance, not independently verified provider usage. No inventory, healing or new input binding is implemented in this asset PR. Next contribution: +2 healing up to 5HP, carry at most one, no wasted full-health use, visible bindings for all control types and focused tests.

## PR 14 — Bell Moth

Decision: retain and select the export as the **prototype design reference** for the next motion submission. Ragged indigo wings, amber eye and cracked bronze bell make a distinct flying silhouette. The pose has some three-quarter depth; motion should keep a consistent readable right-facing side elevation rather than claiming exact bilateral/profile geometry from mirroring alone. A flipped sprite does not prove orthographic anatomy.

RGBA, outer border transparency and 640px visible wingspan pass checks. Body/bell center and flight-body pivot are different concepts: future animation must record a stable body attachment, not simply recenter every changing wing silhouette.

### Corrected scale

Submitted metadata says a 640px wingspan × 0.2 equals 64 units; it actually equals 128. Its runtime preview draws the entire 1024px canvas into 64px, making the visible wingspan 40px. Both claims are superseded by the versioned v002 runtime metrics and preview:

- source visible wingspan 640px;
- uniform scale 0.1;
- displayed full canvas 102.4px;
- visible wingspan 64px.

The future motion brief uses 320px nominal wingspan in 512px cells, where 0.2 is appropriate. Keep reference and motion scales explicit; do not copy one scale to a different source.

Original preview and metadata remain byte-for-byte unchanged. v002 reuses the same PNG; it is a code/metadata correction, not a new image generation. No wingbeat animation, swoop AI or damage path is implemented. Next contribution: the six documented poses with stable core/bell scale and actual warning/contact evidence; flying behavior is a separate bounded PR.

## Merge and validation

Both PRs appended to shared catalog, lock, gallery, test and browser files. Merge resolution unions both submissions, keeps both tests/preview checks and regenerates the gallery from the combined catalog. No source, rejected variant or shared test is discarded.

General unit/resource checks pass on each branch. Final combined checks verify both preview pages, corrected moth scale, all registered hashes and original resources. Gameplay is unchanged by these asset packages; the original encounter remains the live playable scope. These decisions select prototype directions, not finished production animation or a completed Cloister feature.
