# Contributor art jobs

These are ready-to-use generation briefs for outside contributors, including other coding/image models. Submit work through a PR. Maintainer implementation changes go directly to main. No generation is requested by simply reading this document.

For build order, gameplay ideas, dependencies and nice-to-have tasks, start with the [future-content queue](../FUTURE_CONTENT.md). **Next expansion: Ruined Cloister with Bell Moth, healing vial and lever/grate.** The later Cistern/Tower/boss jobs can supply candidates now; runtime integration waits for their listed systems.

## Choose one bounded job

| Job | Deliverable | Gameplay requirement |
| --- | --- | --- |
| [01 Bellwarden crouch](01-bellwarden-crouch.md) | Six crouch/crawl/attack frames | 84-unit crouched hurtbox, low sword attack |
| [02 Bellwarden aerial attack](02-bellwarden-air-attack.md) | Six airborne sword frames | Gravity and horizontal travel continue during a 0.42s attack |
| [03 Hollow Pilgrim melee](03-hollow-pilgrim-melee.md) | Twelve enemy poses | Physical bell staff, anticipation, sweep and recovery; no beam |
| [04 Brazier alpha polish](04-brazier-alpha.md) | Standardized native-alpha prop | Initial real-alpha cutout integrated; improve edges/export |
| [05 Ember alpha](05-ember-alpha.md) | Native-alpha bell/flame pickup | PR 12 integrated; edge/retention follow-up only |
| [06 Gate layers](06-gate-layers.md) | Separate frame, gate and sill | Clear openings and aligned gate movement |
| [07 Break/impact effects](07-break-impact-effects.md) | Six-frame local debris effect | One-shot effect; collectible stays separate |
| [08 Ruined Cloister](08-ruined-cloister.md) | Modular kit and four-screen layout | Next connected map; lever court and optional upper route |
| [09 Flooded Cistern](09-flooded-cistern.md) | Damp stone/water kit and layout | Later valve/lift traversal; swimming excluded from first slice |
| [10 Bell Tower](10-bell-tower.md) | Vertical kit and layout | Later ascent; vertical camera required |
| [11 Bell Moth](11-bell-moth.md) | Selected PR 14 reference; six poses next | Aerial attack target with telegraphed committed swoop |
| [12 Iron Sexton](12-iron-sexton.md) | PR 16 reference selected; eight poses next | Slow committed cleave and punishable recovery |
| [13 Cistern Lurker](13-cistern-lurker.md) | PR 17 reference selected; six poses next | Readable floor tells and low sword contact |
| [14 Pickups/relics](14-pickups-and-relics.md) | PR 13 vial selected; use behavior/key next | One item per PR; inventory/use behavior pending |
| [15 Mechanisms](15-mechanisms.md) | PR 15 lever retained; missing attempt and grate next | Anchored state changes and moving collision |
| [16 Tollkeeper](16-tollkeeper.md) | Boss reference first, then one slam sequence | Later arena and recovery-based boss encounter |

## Shared requirements

Read `docs/ART_DIRECTION.md`, `docs/ASSET_SPEC.md` and `docs/ENCOUNTER.md`. Use only the project's retained references and material you may contribute. Describe the work as original art inspired by Gothic side-scrolling adventures. Do not add external game dumps or extracted proprietary assets.

The final export contract is exact, even if the generator needs a different initial canvas. Keep the untouched generator output alongside the exported sheet and record the transformation. A convincing concept image alone is not a completed animation asset.

- Non-pixel, painted HD artwork; orthographic side view, facing right, consistent costume/proportions/lighting.
- True RGBA PNG: transparent exterior, no checkerboard, no magenta/dark-color key, no background shadow baked into the sheet.
- Keep at least four fully transparent pixels around every cell. No neighboring pose, cropped sword, clipped cape or detached limb may cross a cell boundary.
- Use the same scale throughout a sequence. Draw at the requested cell-relative anchor; do not resize individual frames to fill their cells.
- Keep originals and rejected variants. Add exports as new versioned assets. Never edit or delete a locked submission to make checks pass.
- One candidate plus one correction is the suggested generation budget. If that cannot satisfy the brief, preserve the result as `candidate` and list the failure; do not claim readiness or generate indefinitely.

## PR package

Use `art/contributions/<job-id>/v001/` for `source/`, `exports/`, `submission.json`, and `NOTES.md`. Notes must include the exact prompts, generator/model if known, generation/edit attempt count, references, export steps, outstanding defects, SHA-256 hashes, and expected runtime scale. No credentials or local-machine paths.

`submission.json` must contain:

```json
{
  "jobId": "01-bellwarden-crouch",
  "status": "candidate",
  "assets": [{
    "path": "art/contributions/01-bellwarden-crouch/v001/exports/crouch-v001.png",
    "sha256": "ACTUAL_SHA256",
    "width": 1536, "height": 1024,
    "cellWidth": 512, "cellHeight": 512,
    "referenceHeight": 384, "displayHeight": 144,
    "frames": [{"name":"crouch-idle","x":0,"y":0,"width":512,"height":512,"pivotX":192,"pivotY":464}]
  }]
}
```

The example shows only one frame; supply the exact full sequence from the selected brief. Frame pivots are relative to each cell. Source PNGs need not match export dimensions; both must be retained. Include source hashes in NOTES.md and register all submitted sources in the preservation lock/catalog as part of the PR.

## Required automated checks

```sh
npm ci
node tools/validate-art-submission.mjs art/contributions/JOB/v001/submission.json
npm run validate:assets
npm test
npm run test:encounter
```

The submission validator checks each job's dimensions, frame order, grid bounds, shared anchor, SHA-256, actual transparency, nonempty frames and empty cell borders. It cannot judge anatomy, animation quality or exact visual weapon contact.

The character-sheet validator covers jobs 01–03 only. Jobs 04–16 supply their declared geometry, alpha evidence and general resource checks; do not claim an unsupported job passed this validator. New animation sheets must check their own frame order, dimensions, pivots and border alpha explicitly.

Merging a candidate preserves its contribution; runtime acceptance is a separate decision recorded in the catalog. [PR 11's review](../PR_11_REVIEW.md) illustrates why clean transparent borders and matching declared pivots do not prove complete weapons, stable anatomy or correct costume. Keep candidate status until the visual and runtime evidence passes.

## Required visual acceptance evidence

Provide a preview page or short video that displays the sequence at both source scale and runtime scale against white, black and the abbey backdrop. Include normal playback, paused frames with anchors/body boxes/weapon reach, and left-facing mirrored playback. Show at least three cycles; no camera movement should conceal anchor jitter. Every pose must be completely visible.

Character head/torso size should vary by no more than 5% across comparable poses; persistent anchors may not jump more than two source pixels. Show matching attack timing and contact in the demo. Verify on a narrow viewport as well. If the preview is only a stand-alone sheet player, mark engine integration as pending; passing existing tests does not prove the new sheet is loaded.

Submit only the job's assets, metadata, previews and any narrowly needed integration. PR descriptions should distinguish retained source, accepted export and runtime integration, and list all failures honestly. Do not change combat physics to disguise mismatched artwork.

## Whole-world map resources

The [world contribution workflow](../world/README.md) expands environment jobs into six stage briefs with room graphs, reusable modules, copyable prompts, layout/data examples, dependencies and acceptance checks. Existing Jobs 08–10/15 keep their specialist contracts. New Ossuary Gallery and Counterweight Works are planned extensions. Choose one stage and one bounded deliverable; layouts/code need no image generation.

**Map baseline jobs:** [all six stage layouts](../world/examples/README.md) now have semantic geometry JSON, neutral diagrams and copyable per-stage instructions. Start from the geometry and written theme; preserve v001 and record intentional deviations in v002. Runtime collision, stair paths and dynamic objects remain verification tasks.
