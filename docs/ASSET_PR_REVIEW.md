# Review of asset submissions #5 and #6

Reviewed revisions: #5 `22fa382`, #6 `1592119`. All eight new images were inspected. All original PNGs, proposed JSON metadata and proposal documents are retained byte-for-byte. No new images were generated for this review.

## Disposition

Retain both submissions as a candidate asset library. They add useful designs and material studies, but neither changes the running game. Do not treat them as completed gameplay or parallax integration. The manifest now explicitly records that distinction. Original proposal documents remain historical submissions; the findings below supersede their readiness claims.

## Findings

### P1 — Proposed sprite extraction is incompatible with the runtime

Both new animation atlases specify `transparency: dark-key`. `prepareCharacter` in `prototype/game.js` only implements `magenta-key`; all submitted PNGs are opaque. Loading these sheets through the existing renderer would retain rectangular dark backgrounds. A global dark-color threshold would also erase dark clothing and staff detail. Preserve the originals and create separate, reviewed alpha exports or masks before integration. The brazier, ember, end-cap and pillar also need background extraction; the skyline can remain opaque as a full backdrop.

### P1 — Valid atlas rectangles clip the figures

The validator checks rectangles against image dimensions, not against visible silhouettes. In the enemy sheet, idle's right edge at x=340 clips its right boot; windup starts at x=740 although the staff extends to roughly x=670; strike starts at x=1100 although much of the body and rear leg lie to its left. The airborne apex rectangle starts at y=150 and cuts the mantle's upper edge. Several foot pivots sit below the painted soles, risking floating and scale changes. Some neighboring poses overlap horizontally, so wider rectangular crops alone may include pieces of the neighboring pose. Rebuild extraction bounds and pivots on masked derivatives, then inspect animated previews at gameplay size.

### P2 — End-cap alignment is not measured against the image

`masonry-endcap-v001.json` sets `walkableBaselineY: 110`, while the visible stone top begins around y=215 in the source. Its pale background and the existing module's different framing prevent drop-in attachment. A new export needs a tight crop, consistent stone scale, a measured baseline, and a join test against the current platform texture. Keep the submitted metadata as a draft source, not a collision definition.

### P2 — Passing regression tests do not validate new asset integration

Neither PR changes `prototype/game.js` or `prototype/simulation.js`. The renderer still loads the original three images; airborne state still selects walking pose 2. There is no camera/parallax movement, enemy behavior, destructible brazier or pickup implementation. The original browser tests therefore exercise the original pilot. Checksums, dimensions and valid numeric bounds do not establish correct masking, complete silhouettes or art-direction approval.

### P2 — Character consistency needs an explicit decision

The airborne Bellwarden has a substantially longer flowing mantle than the standing/walking pilot. The enemy poses turn from a left-facing idle/shuffle toward more frontal/rightward action poses. The theme is coherent, but these differences will read as costume or facing changes during playback. Retain every pose as a useful reference; choose the intended costume and facing convention before spending on additional generations.

## Asset decisions and integration order

| Asset | Keep as | Next action |
| --- | --- | --- |
| Distant skyline | Background candidate; first integration candidate | Test as an alternate backdrop, then add camera movement; it remains one combined sky/architecture image and is not seamless |
| Hanging brazier | Interactive prop candidate | Extract alpha, test at 96px, then add strike/drop behavior |
| Consecration ember | Pickup candidate | Preserve glow in alpha export; test at 40px, then add collection |
| Masonry end-cap | Material/edge candidate | Correct crop/baseline and verify joins |
| Buttress pillar | Architecture candidate | Extract alpha, measure base anchor and match stone scale |
| Bellwarden airborne | Motion reference pending cleanup | Resolve mantle consistency, masks, crop and pivots; connect ascent/apex/descent |
| Hollow Pilgrim concept | Enemy design reference | Keep alongside motion sheet; final design approval remains open |
| Hollow Pilgrim motion | Enemy motion reference pending cleanup | Fix extraction/facing, then add behavior and reactions |

## PR management

PR #6 contains the exact #5 commit. Review and land the stack in order: #5 (first candidates), #6 (additional candidates), then this preservation/review change. Use merge commits to retain the ancestry, or explicitly rebase the dependent PRs if choosing squash merges. Do not independently squash both original main-based PRs and assume their shared content is unrelated.

Asset-library acceptance and runtime acceptance are separate decisions. The art can be preserved before gameplay cleanup is complete. Keep roadmap gates open until their exit criteria are demonstrated. Do not delete an unused proposal or replace its source with an edited image.

For future contributions, use one bounded asset family per PR, state whether it is source art or an integrated export, record source IDs and versioned derivatives, and add an in-game preview for any readiness claim. Prefer cleanup and reuse of these submissions before new generation rounds.

## Validation and preservation

The submitted combined branch passes asset validation, eight simulation tests and the desktop/touch browser regression. The preservation check additionally verifies original file hashes and catalog coverage. It deliberately does not claim that masks, crops or pivots pass visual validation. A local Git bundle also preserves the original submitted commit history independently of PR branches.

## Follow-up: PR #8 and demo v0.2

Reviewed #8 at `9ef2ee1`, on top of the preserved #5–#7 stack. It adds four images, four proposed metadata files and a proposal document. All four images were visually inspected. The retention lock includes the nine additions; all 25 retained resources verify unchanged.

- **Left end-cap:** useful counterpart to the earlier right edge. Pale opaque surround and source top near y=215 still require a measured export; its draft baseline is not accepted as collision data.
- **Causeway arch:** useful architecture reference. The image has opaque fill through its arch and a painted broken top. It cannot simply be placed across the playable gap without masking and checking that visible footing agrees with collisions. Retained, not activated.
- **Portal:** accepted as static doorway scenery. The demo uses an explicit source crop (34,95,830,1020) and displays it at (1060,205,330,405), placing the threshold at ground y=610. This keeps the dark doorway intact. Draft portcullis travel and portal trigger metadata are not used; a flattened gate cannot animate independently.
- **Balustrade:** coherent detail, retained for later. Dark-filled openings need masks, and the front-facing panel has visible top/base depth. It is not yet a transparent, seamless railing module.

The new default causeway scene combines the PR #6 skyline and PR #8 portal with the existing playable masonry and character. Finite overscan bounds the skyline's small movement-linked parallax without assuming seamless tiling. The original courtyard remains selectable; switching scenes preserves movement and combat state. A browser gallery exposes all 15 catalogued images, including every unused candidate.

New browser checks exercise both scene selections, mobile switching and decoding all 15 gallery images, alongside the existing traversal and combat checks. Source preservation and eight simulation tests remain required. Character-sheet integration blockers from the first review remain open. No images were regenerated or modified during this update.
