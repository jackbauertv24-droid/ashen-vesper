# Stage 04 — Ossuary Gallery

**Baseline-layout work:** use the [measured geometry example](../examples/v001/04-ossuary-gallery-INSTRUCTIONS.md) as the starting point. The dimensions/beats below are an earlier freeform redesign sketch; they do not override the baseline.

**P2 new candidate stage. Status: planned-runtime-dependencies.** This brief is a target, not a finished map. Follow the [world contribution workflow](../README.md) and [layout contract](../LAYOUT_CONTRACT.md).

## Layout and experience

Planning envelope: **5120 × 1440 world units**, reference viewport 1280 × 720. Room budget: approximately 5 functional rooms; split by gameplay/camera purpose, not arbitrarily per screen. This extends the future queue; it does not replace the existing Cloister/Cistern/Tower briefs.

Two connected gallery bands, each no longer than four horizontal screens: lower entry and a heavy-guard room, an ascent landing, an upper optional relic loop, and a sealed exit. Overall 5120×1440 is a planning envelope, not a demand to fill every coordinate.

1. Lower entry: safe checkpoint and visible route upward.
2. Guard gallery: heavy cleave can be baited with retreat space.
3. Ascent: destination landing visible before committing.
4. Upper loop: optional relic detour returns without reset.
5. Exit: clear door, nearby safe floor and no surprise drop.

Dependency: Vertical camera and safe band transitions; Sexton eight-pose motion and physical cleave; relic inventory remains a separate feature. Use stairs as scenery until stair traversal is implemented; use proven jumps/lift or explicit room portals for playable ascent.

## Asset queue

- niche wall panel
- ossuary pier
- landing cap
- door surround
- background burial arcade

**First bounded art PR:** one niche wall panel; document whether it is background or a decorative alpha cutout. First layout PR: original labelled blockout, room graph, route/checkpoint/portal coordinates and a scrolling preview, using existing art or rectangles. Build layout before spending generation attempts.

## Copyable layout prompt — no image generation

> Design an original Ossuary Gallery stage for Ashen Vesper inside a 5120 × 1440 planning envelope, using the stage beats above. Submit a stage-local JSON layout following docs/world/LAYOUT_CONTRACT.md, a room graph, and a scrolling blockout showing safe main route, optional loop, entry/exit anchors, checkpoints, camera bounds, platforms and proposed encounters. Preserve current movement dimensions: main-route gaps no greater than 90, upward steps no greater than 100, crawl clear height at least 90. Keep visible art, solid collision, hazards and portal transforms separate. Mark every unimplemented system and untested traversal. Verify route and return paths with current controls before claiming gameplay integration. Label the result planning-only if it is not loaded by the runtime.

## Copyable concept prompt — optional reference only

> Paint one original Ossuary Gallery environment reference for Ashen Vesper, inspired by classic Gothic side-scrolling adventures. Quiet limestone burial galleries, inset sealed niches, old iron lamps, pale dust and muted-indigo hangings. Architecture carries the mood; decorations stay subdued. Strict orthographic side-on HD painted non-pixel art, material scale matching the supplied retained abbey masonry, hero visible height 144 game units in later compositing. Show readable floor/landing edges and quiet distant architecture. Use cold blue-gray and muted indigo with restrained amber accents. No characters, HUD, lettering, checkerboard, heavy bloom over traversal or franchise landmarks. This is a mood/composition reference, not a finished playable stage or automatically tileable image.

Concept export: 1024 × 1536 opaque PNG. A concept is optional if retained art already supplies direction. Generate only after listing which production assets it will inform.

## Copyable production prompt — choose one module

> Create ONE original [SELECT ONE MODULE FROM THIS STAGE’S ASSET QUEUE] for Ashen Vesper's Ossuary Gallery. Quiet limestone burial galleries, inset sealed niches, old iron lamps, pale dust and muted-indigo hangings. Architecture carries the mood; decorations stay subdued. Match supplied retained limestone, iron, timber and bronze texture scale as applicable. Orthographic side-scroller elevation, HD painted non-pixel art, same cool lighting direction as the supplied accepted reference. Use the exact chosen export dimensions, pivot, top surface and sockets from docs/world/README.md or the linked specialist brief. Genuine transparent alpha around cutouts and through architectural openings; no scenery, ground-shadow plane, text, checkerboard, loose fog, glow rectangle or cropped extremities. Keep at least 16px clear padding for ordinary architecture; specialist mechanism briefs specify their own margin. A walkable piece has a flat readable contact surface. Do not combine moving and stationary objects. Do not claim repetition until a three-copy seam preview passes.

Use the [Ossuary Gallery related specialist brief](../../art-jobs/12-iron-sexton.md) for existing contracts. Where a new object has no specialist contract, write exact dimensions, runtime scale, anchors and layer purpose into the PR before generating it; defaults in the world workflow apply only to the specified module types.

## Stage-specific acceptance

- Show every listed beat in labelled layout and normal scrolling; show optional-route return and destination safety.
- Show real-size hero and appropriate existing/selected enemy references; a static reference is not a working enemy.
- Render black/white/cold-blue and assembled-stage composites, normal and grayscale, at source and runtime scales.
- Record source/export hashes, all attempts including rejected outputs, actual prompt/model and known or unknown cost.
- Use exact portal entry/exit anchors and room-camera bounds; no arbitrary shifts to hide alignment faults.
- Vertical layout is blocked from runtime acceptance until camera, landing visibility, platform carrying and checkpoint return are proven.
- Apply resource and gameplay checks listed in the world workflow. Separate art candidate, selected prototype and integrated stage status.
