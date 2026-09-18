# Ossuary Gallery — layout baseline contribution

Use this as the geometry starting point, then make any adjustments in a recorded v002 deviation. [Layout JSON](04-ossuary-gallery.json) · [neutral diagram](04-ossuary-gallery.svg) · [scrolling preview](preview.html) · [shared workflow](../README.md).

**Bounds 16012 × 1168; 3 rooms, 2 joins.** This example takes priority over the earlier freeform envelope when submitting a baseline-layout PR. It is not the current playable Pilgrim Road or a finished stage.

## Written art direction

Ossuary galleries with pale weathered limestone burial niches, broken iron screens and dusty indigo cloth, a low entry passage followed by an upper gallery. Burial decor is quiet; no loose haze over floor edges.

Original HD painted non-pixel art; side-on orthographic camera; readable surfaces, quiet backgrounds, uniform material scale and restrained amber accents. No source scenery is supplied. Invent wall ornament, landmarks, foliage and material details within this description; fit them around the supplied geometry. Props do not silently add collision.

## Room placements

Coordinates are world units. Add room origin to room-local geometry. Each band has 640 units of visible layout height. Bounds may start at a nonzero local x because doorway margins are cropped. Candidate solid count is a geometry inventory, not a request for that many images.

| Room | Stage origin | Local clipped bounds | Candidate solid rectangles | Stair control guides |
| --- | --- | --- | --- | --- |
| 04-A | (0, 488) | x=0..5964, y=0..640 | 58 | 0 |
| 04-B | (5772, 40) | x=192..6144, y=0..640 | 3 | 0 |
| 04-C | (11916, 40) | x=0..4096, y=0..640 | 13 | 0 |

## Connections

Anchors below are **layout correspondence points**, not guaranteed player-feet spawn coordinates. Destination support/headroom and the logical-position-to-feet offset must be verified by code contributors. Given origins, each pair meets exactly in both x and y. Only supplied directed transitions are established; do not assume every door is freely reversible.

| Join | Direction | Feature / connection | Exit local | Entrance local |
| --- | --- | --- | --- | --- |
| 04-join-1 | 04-A → 04-B | platform-scene / portal | (5964, 64) | (192, 512) |
| 04-join-2 | 04-B → 04-C | doorway / seam | (6144, 512) | (0, 512) |

No shared-space overlap is declared in this example.

## Exact geometry/art deliverables

1. **No-generation blockout:** render all rooms from JSON, with candidate solids, top-edge guides, stair regions/control anchors, unknown regions and connections separately labelled. Show arrival room, the supplied connected route, each vertical-band change and the ending room. Add safe spawns/checkpoints as separately reviewed candidate data. A freely scrolled preview is planning evidence; traversal still needs actual input.
2. **Reusable architecture kit:** start with one floor/landing module or one pier/arch appropriate to this theme. Reuse it at supplied top edges; wall fills and background panels are separate. Default architectural textures should stay uniformly scaled; do not stretch one module across every irregular rectangle. A 32-unit grid guides joints; named exceptions at scene planes remain exact.
3. **Stair kit where present:** separate stair flights, landings and trim. Proposed first stair flight: 1024×1024 RGBA, runtime256×256 at .25, source contact sockets (64,960) and (960,64), ≥16px exterior clear padding; nominal socket rise/run224. Show two joined copies at both facings; no perspective stairs or floor-shadow plane. This is an art-module proposal, not an assertion every supplied stair guide has that path length. The integrator must match actual verified flight endpoints, shorten through versioned modules or request an explicit layout change. Do not infer a playable slope merely from painted steps.
4. **Background layer:** derive coverage from the room union; keep distant architecture independent of collision. Assemble layers from reusable pieces, not one giant generation. Provide camera/parallax limit previews. Ordinary alpha/background/module defaults are in the shared workflow.
5. **Mechanism/enemy placement:** mark proposed locations rather than claiming exact recovered spawns. Add only the selected project reference needed by this stage; behavior and encounter tuning remain separate tasks. Shared-space pickups/enemies cannot duplicate through room reload.

## Copyable prompt — baseline layout/adapter

> Implement a planning blockout for Ashen Vesper stage 04-ossuary-gallery from docs/world/examples/v001/04-ossuary-gallery.json. Keep all supplied room origins, clipped bounds and connection anchors; render candidate static solids/top edges, stair regions/guides and unknown areas in separate neutral styles. The stage is 16012 × 1168 world units. Validate all joins in both axes and all shared-space ownership. Use current hero artwork height144 only for comparison; actual collision body dimensions and stairs/camera behavior need explicit adaptation. Add named safe feet spawns/checkpoints with support/headroom checks, proposed hazard/moving-platform data only where verified, and meaningful traversal/return/restart tests if integrating. Do not treat empty lists as proof objects are absent. Record every geometry/physics change in a new deviation version; do not shrink the stage or remove difficult gaps just to pass current demo constraints. No image generation is required. Label unimplemented behavior and manual checks honestly.

## Copyable prompt — one HD module

> Create ONE original [NAMED FLOOR / LANDING / PIER / ARCH / STAIR / WALL MODULE] for Ashen Vesper's Ossuary Gallery. Ossuary galleries with pale weathered limestone burial niches, broken iron screens and dusty indigo cloth, a low entry passage followed by an upper gallery. Burial decor is quiet; no loose haze over floor edges. Strict side-on orthographic HD painted non-pixel game art. Use the chosen exact canvas, uniform runtime scale, contact edge and sockets from the shared module contract or stair proposal above. Fit the supplied neutral layout bounds/contact guides while inventing ornament and surface detail from this written theme. Real transparent alpha around cutouts and through openings, complete silhouette, no room scenery, characters, text, checkerboard, ground-shadow plane, loose haze or glow box. Keep required clear padding. Separate moving and stationary parts. Match project material scale; show source/runtime white, black, blue, grayscale and assembled-room previews. Preserve every original generation attempt and exact actual prompt, including rejects; report model/attempts/cost or unknown.

Replace the bracket with one concrete object and copy its numeric contract into the actual prompt. Include a neutral geometry mask if useful; never require a source game screenshot to complete the assignment.

## Acceptance and unknowns

- Inspect all 3 rooms, supplied joins, optional candidate routes and checkpoints, at room and full-stage scale. Camera needs multiple vertical bands; current fixed horizontal demo support is insufficient for an integration claim.
- Candidate static collision is derived geometry. Verify actual floor/body contact, solid sides/undersides and movement; top-edge lists are not a guarantee of headroom or safety.
- No unknown geometry rectangle remains inside the displayed bands, but that does not verify hazard, dynamic-object or collision behavior.
- Stair control anchors do not supply every full flight, length or interaction tolerance. Moving platforms, hazard bounds, enemy spawns, item placements and safe checkpoints remain incomplete in this version.
- Show hero-scale source-over alpha composites and tiled-module seams, plus both facings where relevant. Passing a neutral diagram render is not acceptance of art or gameplay.
- Preserve v001; [record deviations](deviation.example.json) in v002+. Shared resource checks and existing-route regression must pass. No image generation is needed for geometry validation.
