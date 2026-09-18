# Stage 03 — Flooded Cistern

**Baseline-layout work:** use the [measured geometry example](../examples/v001/03-flooded-cistern-INSTRUCTIONS.md) as the starting point. The dimensions/beats below are an earlier freeform redesign sketch; they do not override the baseline.

**P2 after mechanisms. Status: planned.** This brief is a target, not a finished map. Follow the [world contribution workflow](../README.md) and [layout contract](../LAYOUT_CONTRACT.md).

## Layout and experience

Planning envelope: **5120 × 720 world units**, reference viewport 1280 × 720. Room budget: approximately 4 functional rooms; split by gameplay/camera purpose, not arbitrarily per screen. 

Four horizontal screens: dry receiving ledge, low vault branch, valve/lift crossing, sluice exit. Optional lower passage rejoins a dry platform; water hazard and scenery stay separate.

1. Entry: checkpoint on dry floor with clear water boundary.
2. Vaults: optional low passage; no enemy inside a crawl bottleneck.
3. Crossing: two visible valve links and declared lift endpoints.
4. Sluice: ambush warning on dry reachable ground and safe exit.

Dependency: Proven lever/valve links and lift behavior. Selected Lurker reference needs motion, warning and visible low blade/core contact. No swimming system is planned.

## Asset queue

- damp platform cap
- vault pier
- sluice frame
- water strip
- subdued vault background

**First bounded art PR:** one damp platform cap with three-copy seam evidence. First layout PR: original labelled blockout, room graph, route/checkpoint/portal coordinates and a scrolling preview, using existing art or rectangles. Build layout before spending generation attempts.

## Copyable layout prompt — no image generation

> Design an original Flooded Cistern stage for Ashen Vesper inside a 5120 × 720 planning envelope, using the stage beats above. Submit a stage-local JSON layout following docs/world/LAYOUT_CONTRACT.md, a room graph, and a scrolling blockout showing safe main route, optional loop, entry/exit anchors, checkpoints, camera bounds, platforms and proposed encounters. Preserve current movement dimensions: main-route gaps no greater than 90, upward steps no greater than 100, crawl clear height at least 90. Keep visible art, solid collision, hazards and portal transforms separate. Mark every unimplemented system and untested traversal. Verify route and return paths with current controls before claiming gameplay integration. Label the result planning-only if it is not loaded by the runtime.

## Copyable concept prompt — optional reference only

> Paint one original Flooded Cistern environment reference for Ashen Vesper, inspired by classic Gothic side-scrolling adventures. Low damp slate vaults, oxidized iron sluices, dark water below dry ledges, small amber valve lamps. Strict orthographic side-on HD painted non-pixel art, material scale matching the supplied retained abbey masonry, hero visible height 144 game units in later compositing. Show readable floor/landing edges and quiet distant architecture. Use cold blue-gray and muted indigo with restrained amber accents. No characters, HUD, lettering, checkerboard, heavy bloom over traversal or franchise landmarks. This is a mood/composition reference, not a finished playable stage or automatically tileable image.

Concept export: 2048 × 1024 opaque PNG. A concept is optional if retained art already supplies direction. Generate only after listing which production assets it will inform.

## Copyable production prompt — choose one module

> Create ONE original [SELECT ONE MODULE FROM THIS STAGE’S ASSET QUEUE] for Ashen Vesper's Flooded Cistern. Low damp slate vaults, oxidized iron sluices, dark water below dry ledges, small amber valve lamps. Match supplied retained limestone, iron, timber and bronze texture scale as applicable. Orthographic side-scroller elevation, HD painted non-pixel art, same cool lighting direction as the supplied accepted reference. Use the exact chosen export dimensions, pivot, top surface and sockets from docs/world/README.md or the linked specialist brief. Genuine transparent alpha around cutouts and through architectural openings; no scenery, ground-shadow plane, text, checkerboard, loose fog, glow rectangle or cropped extremities. Keep at least 16px clear padding for ordinary architecture; specialist mechanism briefs specify their own margin. A walkable piece has a flat readable contact surface. Do not combine moving and stationary objects. Do not claim repetition until a three-copy seam preview passes.

Use the [Flooded Cistern related specialist brief](../../art-jobs/09-flooded-cistern.md) for existing contracts. Where a new object has no specialist contract, write exact dimensions, runtime scale, anchors and layer purpose into the PR before generating it; defaults in the world workflow apply only to the specified module types.

## Stage-specific acceptance

- Show every listed beat in labelled layout and normal scrolling; show optional-route return and destination safety.
- Show real-size hero and appropriate existing/selected enemy references; a static reference is not a working enemy.
- Render black/white/cold-blue and assembled-stage composites, normal and grayscale, at source and runtime scales.
- Record source/export hashes, all attempts including rejected outputs, actual prompt/model and known or unknown cost.
- Use exact portal entry/exit anchors and room-camera bounds; no arbitrary shifts to hide alignment faults.
- Show both camera presets and narrow touch layout; no edge hides a gap or incoming threat.
- Apply resource and gameplay checks listed in the world workflow. Separate art candidate, selected prototype and integrated stage status.
