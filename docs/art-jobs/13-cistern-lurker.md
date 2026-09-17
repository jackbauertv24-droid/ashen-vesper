# Job 13 — Cistern Lurker low ambush enemy

Priority P2, after Cistern layout. A crawling relic creature with a readable floor-level tell, offering low sword targets instead of another standing guard.

## Design prompt

> Design one original Cistern Lurker for Ashen Vesper: a low many-jointed stone-and-root creature formed around a cracked small iron reliquary, muted moss limbs, restrained amber core behind a grille, weathered damp material matching the supplied cistern stone. Right-facing orthographic side silhouette, crouch-height threat, HD painted non-pixel. Complete connected anatomy, clear forward head/core, genuine alpha, no water backdrop, mud rectangle, text, checkerboard, loose fog or glowing beam.

## Motion prompt after reference selection

> Animate the selected Cistern Lurker with the same reliquary/core, limb count, proportions and materials. Six side-profile poses: hidden low rest, emerging warning, crawl A, crawl B, short forward lunge, recoil/recovery. Keep core scale and floor anchor fixed; limbs bend naturally. 1536 × 1024 RGBA, 3 × 2 512 cells, ground pivot (256,448), 12px clear padding, no effects/backdrop/text or silhouette overlap.

## Contract and acceptance

Reference 1024 × 1024 RGBA. Motion silhouette nominal 320 × 160 source pixels, runtime 96 × 48 (scale 0.3). Names rest/emerge/crawl-a/crawl-b/lunge/recover. Separate alpha layer can cover rest with moss only if emergence remains obvious; no invisible attack.

Proposed HP 2, damage 1, emerge warning 0.7s, lunge 0.25s, recovery 0.9s. First version spawns on dry traversable platforms, not inside walls or inaccessible water. Low thrust hits its core, jumping can avoid a ground lunge, and standing sword should not be guaranteed to reach a target below its visible blade.

Show low-attack guide alignment, matching limb count and anchored crawl at source/runtime scale over white/black/blue/stone. Integration shows warning before damage, miss/hit geometry, one hit per sword swing, no sinking into ground and no spawn directly under a respawning player.
