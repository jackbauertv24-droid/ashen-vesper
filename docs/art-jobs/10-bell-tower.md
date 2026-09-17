# Job 10 — Bell Tower vertical map kit

Priority P2: prepare art/layout now; runtime waits for vertical camera and moving-platform support.

## Copyable prompts

> Paint an original moonlit Gothic bell-tower interior reference for Ashen Vesper in strict side-scroller elevation. Tall broken stone shaft, timber landings, suspended bronze bell, visible iron counterweights, slivers of cold sky and sparse warm lamps. HD painted non-pixel materials matching supplied abbey masonry. Show readable ascending routes, safe rest landings and a broad upper arena. No characters, HUD, lettering, dramatic perspective that obscures platform tops or heavy bloom.

> Create ONE [tower landing / timber support / bell support arch / bronze bell] from the supplied tower design as a complete orthographic game cutout. Same limestone/aged timber/iron/bronze scale, cool moonlight, true alpha and 16px clear padding. Transparent openings, no room backdrop, ground shadow, text, checkerboard or chain clipping. Keep attachment sockets explicit; bell, support and counterweight must be separate pieces.

## Contract and tests

Concept reference: 1024 × 1536 opaque PNG. It describes vertical composition, not collision geometry or a finished background layer.

Proposed world 2560 × 2160, 1280 × 720 viewport. Blockout includes landing coordinates, camera rest bands, lift endpoints, checkpoints and proposed 1280-wide boss space. Do not implement this size through current horizontal-only assumptions.

First production assets: landing 1024 × 256 RGBA/runtime 240 × 60/top y=32; support arch 1024 × 1024 RGBA/runtime 240 × 240/ground pivot (512,960); bell later 1024 × 1024 RGBA/runtime 160 × 160/hanging pivot (512,64). Keep actual sockets, painted mass and collision separate.

Preview three stacked landings with hero at real scale, complete alpha over sky/stone, readable ascending silhouettes. Integration must test camera at top/bottom, landing visibility before jumps, lifts carrying player, underside contact and respawn on a safe landing. No blind forced drop or automatic camera snap used to disguise a bad layout.
