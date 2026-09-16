# Retained asset library

Every submitted asset is worth retaining, even when it is not selected for the current game. The source images stay at their original paths and resolution. Selection, cleanup status and engine integration are tracked separately in the [manifest](../manifest.json).

## Preservation rules

- Never overwrite or delete an original because it is unused, superseded or needs cleanup.
- Keep submitted metadata and proposal notes with their sources. Proposed coordinates are not validated collision data.
- Save masks, corrected atlases and exports under new versioned names; record their source asset IDs.
- Preserve alternative designs as references. An asset can be retained without being approved for the game.
- Add future submissions to `submissions.lock.json`; do not rewrite prior hashes to make a changed source pass.
- Run `npm run validate:assets` to check retained bytes and image catalog coverage.

## Submitted candidates

| Source | Preview | Review |
| --- | --- | --- |
| PR #5 | [Hanging brazier](../production/props/hanging-brazier-v001.png) | Mask and gameplay pending |
| PR #5 | [Consecration ember](../production/props/consecration-ember-v001.png) | Glow-preserving mask and pickup behavior pending |
| PR #5 | [Masonry end-cap](../production/abbey/masonry-endcap-v001.png) | Baseline and join cleanup pending |
| PR #5 | [Hollow Pilgrim concept](../concepts/hollow-pilgrim-concept-v001.png) | Retained enemy design reference |
| PR #6 | [Bellwarden airborne](../production/bellwarden/bellwarden-airborne-v001.png) | Costume, crop, mask and pivot review pending |
| PR #6 | [Distant skyline](../production/abbey/skyline-distant-v001.png) | Alternate backdrop candidate |
| PR #6 | [Hollow Pilgrim motion](../production/enemies/hollow-pilgrim-motion-v001.png) | Facing, crop, mask and behavior pending |
| PR #6 | [Buttress pillar](../production/abbey/buttress-pillar-v001.png) | Mask and anchor alignment pending |

See the [PR review](../../docs/ASSET_PR_REVIEW.md) for evidence, priorities and integration order. These links expose the full original resources; none are discarded or regenerated.
