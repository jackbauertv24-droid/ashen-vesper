# Maintainer review — PRs 34–38

All submitted originals, exports, prompts, notes, metadata, previews and review
composites are retained and locked. Maintainer image-generation attempts: zero.

Every claim below was verified independently rather than read from the
submission notes, per [the build standard](BUILD_STANDARD.md). Connected-
component and tiling measurements were run against the submitted PNGs.

## Decisions

- **PR34 Iron Sexton motion cleanup (v004): retained candidate, not integrated.**
  Both stated corrections are real and were confirmed. Connected-component
  analysis of all eight cells shows zero detached fragments, against v003's
  1,014 px fragment in `recover` and 2,576 px in `hurt`. Walk cadence is
  genuinely distinct: step-a against step-b now differs by 68.9% of the union
  silhouette, against 27.0% in v003.

  It is still not integrable, for a new reason. **The hurt cell has no shovel
  at all.** v003 showed the Sexton holding the shovel with a broken-off blade
  fragment beside it; v004 removed the fragment by deleting the entire weapon.
  In play the enemy's shovel would vanish on every hit and reappear on
  recovery, which is a worse continuity break than the artifact it replaced.
  The submission's note that "both hands maintain continuous, unbroken contact
  with the heavy iron grave shovel throughout all 8 frames" is not accurate for
  that cell. A v005 needs the shovel present and held in `hurt`; the other
  seven cells are good and should be carried over unchanged.

- **PR35 Tollkeeper boss motion (v003): selected motion candidate.** All six
  cells are single contiguous components with consistent mass (110k–133k px),
  so no cell has lost its weapon. The clapper polearm is present and
  two-handed throughout, and the 1.2s tell → 0.35s slam → contact → 1.3s
  punish sequence reads clearly at the 220-unit runtime lineup. Boss arena,
  AI and hit reactions remain separate work under M4.5.

- **PR36 Ossuary burial niche panel (v002): selected prototype.** The
  pseudo-lettering the PR26 review rejected is gone; the memorial tablet is
  now clean uncarved limestone. Retained for the Ossuary blockout under M4.2.

- **PR37 Cistern unlit vault pier and hanging lantern (v002): selected
  prototype.** This correctly resolves the PR28 finding: the baked-in lantern
  is separated into an independent prop, so a colonnade no longer repeats
  identical light sources. Pier and lantern both hold their declared bounds
  and pierced transparency.

- **PR38 seamless damp platform kit (v002): selected; center strip passes the
  tiling contract.** Measured independently: edge columns opaque, seam colour
  delta 0.0, and cool-to-warm drift 2.6 across the strip — well inside the
  limit of 8, against 65.5 for the v001 cap that was tiling as visible stripes
  on Pilgrim Road. This is the first submission to clear the tiling contract
  on arrival. Integration waits on the Cistern stage existing.

  Minor, non-blocking: the PR's own review composite has a layout fault —
  hero sprites overlap the "Complete Assembly" heading and two panel labels
  are clipped at their container edge. The asset is unaffected; only the
  evidence page is harder to read.

## Integration status

None of these are integrated. Four target stages that do not exist yet, and
PR34 is blocked on the hurt-cell weapon. This is consistent with the current
direction recorded in [the milestone queue](NEXT_MILESTONES.md): no new stage
until the engine is one engine. Art supply is not the constraint.

## Merge note

All five branches predate the runtime and test restructuring on main and each
modified `tools/browser-check.mjs`, which has been removed. They were merged
with that deletion kept, their additive registry entries unioned into
`art/manifest.json`, `art/library/submissions.lock.json` and the gallery, and
their structural tests carried across whole. PRs 34–38 are now recorded in the
preservation lock. The obsolete `runtime floor slice` crop test that these
branches still carried was dropped again; it is superseded by the tiling
contract in `test/runtime-contract.test.mjs`.

## Validation boundary

Structural tests validate dimensions, alpha, anchors and declared seam pixels.
Connected-component and tiling measurements validate continuity and repeat.
Neither certifies that a pose sequence reads well in motion, and none of them
is evidence of behaviour: runtime integration still requires actual-input
traversal and a composed-frame check.
