# Contributor art jobs

These are ready-to-use generation briefs for outside contributors, including other coding/image models. Submit work through a PR. Maintainer implementation changes go directly to main. No generation is requested by simply reading this document.

## Choose one bounded job

| Job | Deliverable | Gameplay requirement |
| --- | --- | --- |
| [01 Bellwarden crouch](01-bellwarden-crouch.md) | Six crouch/crawl/attack frames | 72-unit crouched hurtbox, low sword attack |
| [02 Bellwarden aerial attack](02-bellwarden-air-attack.md) | Six airborne sword frames | Gravity and horizontal travel continue during a 0.42s attack |
| [03 Hollow Pilgrim melee](03-hollow-pilgrim-melee.md) | Twelve enemy poses | Physical bell staff, anticipation, sweep and recovery; no beam |

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

## Required visual acceptance evidence

Provide a preview page or short video that displays the sequence at both source scale and runtime scale against white, black and the abbey backdrop. Include normal playback, paused frames with anchors/body boxes/weapon reach, and left-facing mirrored playback. Show at least three cycles; no camera movement should conceal anchor jitter. Every pose must be completely visible.

Character head/torso size should vary by no more than 5% across comparable poses; persistent anchors may not jump more than two source pixels. Show matching attack timing and contact in the demo. Verify on a narrow viewport as well. If the preview is only a stand-alone sheet player, mark engine integration as pending; passing existing tests does not prove the new sheet is loaded.

Submit only the job's assets, metadata, previews and any narrowly needed integration. PR descriptions should distinguish retained source, accepted export and runtime integration, and list all failures honestly. Do not change combat physics to disguise mismatched artwork.
