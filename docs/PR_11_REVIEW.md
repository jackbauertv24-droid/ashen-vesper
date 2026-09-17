# PR 11 — aerial attack candidate review

Decision: merge for preservation and preview access; **not accepted for runtime replacement**. The original, export, prompt, notes, submission metadata and preview remain intact.

## Findings

1. **Contact A is incomplete.** The sword reaches the right boundary of the raw generator output and its tip is cut off. Transparent cell padding in the repacked export does not restore missing artwork. Preserve this frame as evidence; a corrected source is needed.
2. **Scale and anchors need visual correction.** The export gives every frame the same metadata pivot, but character head size and apparent body placement differ substantially, especially contact A versus contact B. The validator checks declared anchors and borders, not the anatomical consistency of the silhouettes. Align hips and normalize body scale using the intact source poses; do not resize each pose merely to fill a cell.
3. **Costume differs from the brief.** Several poses add a long trailing ivory cape. The ground reference uses a short mantle. Keep these as motion studies; an accepted sequence needs the established costume.
4. **Acceptance evidence is incomplete.** The preview supports backgrounds, scales, mirrored playback, frame stepping and guides, but it does not demonstrate transitions from jump ascent/apex/descent or landing during an attack. Existing encounter tests exercise the old runtime poses. Their passing does not certify this sheet's integration.
5. **Transparency needs edge review.** The RGBA export passes structural checks. Some cloth interiors and outline pixels appear eroded after background removal; review against white and black at source scale before calling the extraction clean.

## Verified

- Submission dimensions, RGBA, hashes, frame order, declared pivots, alpha occupancy and clear cell borders pass the contributor validator.
- Asset hashes and preservation checks pass. Existing gameplay tests pass.
- Preview reviewed in a browser at source/runtime scale, both facings and available backgrounds.
- No gameplay or physics changes are submitted. Runtime remains pending.

## Next bounded contribution

Preserve v001. Add v002 derivatives correcting scale, hip placement and edge extraction for intact poses. Supply a complete contact pose with an uncut sword and short mantle. Provide actual jump and landing transition evidence at gameplay scale. Reuse intact source work where possible; no unlimited regeneration is requested.

The PR description's claim of strict adherence is stronger than the evidence. `candidate` is the appropriate status. Merging retains the contribution and does not certify a completed production animation.
