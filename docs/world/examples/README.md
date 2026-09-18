# Six-stage layout examples — geometry baseline

These examples provide concrete room arrangements to start from, with an independently designed HD art layer. Contributors get **semantic layout geometry and written art direction**. The diagrams contain flat rectangles, lines and labels; no source scenery, sprites, textures, palette data or source-repository references are included.

Start with [the neutral scrolling preview](v001/preview.html) or [whole-world panel overview](v001/world-overview.svg), then pick one stage instruction and one bounded deliverable.

| Stage / instructions | Layout data | Neutral diagram | Bounds in world units | Rooms / joins |
| --- | --- | --- | --- | --- |
| [01 Pilgrim Road](v001/01-pilgrim-road-INSTRUCTIONS.md) | [JSON](v001/01-pilgrim-road.json) | [SVG](v001/01-pilgrim-road.svg) | 13920×1360 | 5 /5 |
| [02 Ruined Cloister](v001/02-ruined-cloister-INSTRUCTIONS.md) | [JSON](v001/02-ruined-cloister.json) | [SVG](v001/02-ruined-cloister.svg) | 8192×2640 | 6 /5 |
| [03 Flooded Cistern](v001/03-flooded-cistern-INSTRUCTIONS.md) | [JSON](v001/03-flooded-cistern.json) | [SVG](v001/03-flooded-cistern.svg) | 14336×2000 | 5 /4 |
| [04 Ossuary Gallery](v001/04-ossuary-gallery-INSTRUCTIONS.md) | [JSON](v001/04-ossuary-gallery.json) | [SVG](v001/04-ossuary-gallery.svg) | 16012×1168 | 3 /2 |
| [05 Counterweight Works](v001/05-counterweight-works-INSTRUCTIONS.md) | [JSON](v001/05-counterweight-works.json) | [SVG](v001/05-counterweight-works.svg) | 9216×2640 | 6 /5 |
| [06 Bell Tower](v001/06-bell-tower-INSTRUCTIONS.md) | [JSON](v001/06-bell-tower.json) | [SVG](v001/06-bell-tower.svg) | 11944×2000 | 5 /6 |

## What to preserve first

- Room lengths, vertical-band placement, floor/gap topology and correspondence anchors.
- Supplied directed connections and re-entry consistency. Do not replace a leftward or upward route with a straight rightward corridor.
- Intentional shared corridor in Stage05; one owner handles collision and persistent objects in the overlap.
- Explicit unknown regions. Missing data is not permission to invent safe floor silently.

Invent textures, colors within the written theme, ornament, architecture identity, foliage and room landmarks. Fit visual contact surfaces to geometry. First submit a faithful blockout or reusable art candidate; later versions may tweak routes/add ideas with a [deviation record](v001/deviation.example.json).

## Coordinates and limitations

Examples use a uniform layout grid of32 world units, viewport1280×720 and nominal hero artwork height144. Each visible room band is640 units high, with40-unit stage top/bottom margins. Room origins and cropped doorway planes include deliberate off-grid values. Room `bounds.x` may be nonzero. Geometry is local; stage position equals room origin plus local coordinate.

These larger examples take priority over the guide's earlier freeform envelopes **when doing baseline-layout work**. The existing playable Road remains6400×720; these files do not replace runtime constants. Current ≤90 gaps/≤100 steps recommendations belong to the earlier freeform layouts, not constraints that justify silently modifying this baseline. A code contributor must validate movement/camera/stair support and document adaptations.

- `solids`: **candidate** static collision rectangles, derived from geometry classes; not certified for all gameplay behavior.
- `topEdges`: candidate solid tops with clear space immediately above; no guarantee of standing headroom, correct feet offset or safe landing.
- `stairRegions`: layout class regions; `stairGuides`: control anchors/directions, not complete flight endpoints or paths.
- `connections`: exact correspondence anchors whose transformed x/y agree. Even a measured connection point is not a validated feet spawn.
- `stagePortals`: directed stage links with arrival/departure guides. They are not spatial stage seams or guaranteed safe destinations; Stage04 arrival especially requires a floor/feet check.
- `unknownAreas`: explicitly unassigned geometry, shown pink. A mostly filled map does not prove all collision/hazard data known.
- Empty `spawns/checkpoints/hazards/movingPlatforms/encounters/art` lists mean **not supplied**. Static layout diagrams do not capture moving objects, spike damage, enemies or pickups. Final arena/ending behavior needs an independent integration task.

v001 includes30 rooms,27 exact two-axis joins and95 stair control guides. Classification and coordinate conversion have structural checks; physics/contact, stair lengths and dynamic hazards still need measured verification. The source artwork is not required or provided to contributors. The scope is all six stage layout examples, not a claim to have fully recreated every game behavior.

## First PRs we can use

1. One stage's playable rectangle blockout with verified spawns/checkpoints and a deviation log if needed.
2. One stage's floor/arch/pier/stair module with exact contact sockets and real alpha.
3. A neutral overlay showing geometry, visible blade/core alignment, or stair flight verification.
4. A room adapter/camera/stair implementation that preserves the baseline and existing demo regression.

Each stage instruction includes copyable blockout and art prompts, room/connection tables and explicit acceptance gaps. Architecture contracts remain in [the world workflow](../README.md); room integration contract in [LAYOUT_CONTRACT.md](../LAYOUT_CONTRACT.md). Extend `submission.json` with the stage/room IDs and geometry placements your asset fits. Use [the contributor PR body](../templates/PR_BODY.md).

## Reproduce neutral diagrams and structural checks

From repository root:

```sh
node tools/world-layout-examples.mjs
node tools/world-layout-examples.mjs --render
npm run dev
```

Open `/docs/world/examples/v001/preview.html`. The renderer reads public semantic JSON only; it needs no source game imagery. Structural checks cover bounded rectangles, connected room graph, stage references and exact both-axis anchor equations. These are not traversal/collision tests. Keep the baseline version stable; change geometry in v002 with an explicit record and versioned diagrams. After adding a v002 index/layout set, use `node tools/world-layout-examples.mjs --version v002 --render`.
