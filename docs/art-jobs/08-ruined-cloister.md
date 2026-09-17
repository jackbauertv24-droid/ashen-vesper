# Job 08 — Ruined Cloister map kit

Priority P1: next playable location. Original abandoned abbey garden/court, distinguished from the exposed Pilgrim Road by enclosed arches, a dry fountain and restrained moss. Reuse limestone/brass/indigo palette and existing material scale.

## Copyable prompts

Environment concept, reference only:

Concept canvas: 2048 × 1024 opaque PNG. It is visual reference, not the 5120px level or a tileable backdrop.

> Paint an original ruined Gothic abbey cloister for Ashen Vesper: enclosed broken arcades, cold moonlit open roof, dry fountain, muted moss, sparse amber lanterns, far bell tower. HD non-pixel game art, strict side-on camera. A safe entrance at left, broken arcade traversal in the middle, small lever machinery court and grate exit at right. Clearly separate floor and platform silhouettes from distant architecture; no fog on playable edges, characters, lettering, HUD or copied franchise architecture. Show how a coherent horizontal 2D level can be assembled from reusable stone.

Modular asset prompt; use separately for each chosen piece:

> Create ONE modular [arcade pier / arch span / platform cap / dry fountain / moss patch] for Ashen Vesper's moonlit ruined cloister. Match supplied retained masonry's worn limestone, cool blue-gray shading and restrained moss. Strict orthographic side-scroller elevation, painted HD non-pixel art. Genuine transparent background and open negative spaces, complete silhouette, no sky/floor scene/characters/text/ground shadow. Flat readable top edge for walkable pieces; architecture shading must not imply a different collision plane. Keep 16px transparent padding. Do not pack multiple disconnected props in one image or claim a repeated seam without testing it.

## Contract

- Layout: four horizontal screens, 5120 × 720, reference viewport 1280 × 720. Blockout JSON/JS with explicit geometry and spawn/interaction/checkpoint links; main floor y=600, gaps at most 90, steps at most 100, crawl clearance at least 90.
- First bounded asset PR: one arch span and one pier. Each 1024 × 1024 RGBA, runtime 240 × 240, common ground pivot (512,960). Record arch opening bounds and sockets. Art collision stays separate; decorative arch is not automatically solid.
- Platform cap: 1024 × 256 RGBA, runtime 240 × 60, top surface y=32 source, left/right sockets recorded. Any tiling claim needs a three-copy seam preview.
- Background arcade layer is a later PR: 2048 × 1024 RGBA, runtime 1280 × 640, camera factor proposed 0.45, no foreground collision. Preserve source and separate export.
- Fountain/moss are optional later props; record pivots and bounds before generation. Concept PNG does not substitute for the kit.

## Acceptance

Preview assembled kit over existing sky with hero/guard at their actual runtime sizes. Grayscale floor edges, complete transparent openings, no matte veil. Show entrance, optional upper route, moth space, lever/grate sightline and exit. Traverse with current jump/crouch physics and both camera modes; narrower viewport and checkpoint return must remain readable. A map-art PR may stop at a validated blockout/kit but must label room transition/enemy/lever integration pending. Shared preservation and browser/resource checks apply.
