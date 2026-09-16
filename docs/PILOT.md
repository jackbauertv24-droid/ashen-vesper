# Courtyard art study

An original Gothic platformer study inspired by classic side-scrolling adventures. The purpose is to evaluate modern painted artwork at gameplay scale.

## What is playable

The Bellwarden walks, faces both directions, jumps across an 80-unit gap, and attacks a brass practice ward. A raised ledge supports one-way landing. Falling resets the character; successful strikes remain counted. The renderer uses a 1440 × 810 scene with a fixed 60 Hz simulation.

A/D or arrows move; Space jumps; J attacks; R resets. Direction is committed at jump takeoff. Attacking locks movement for 25 simulation frames. Its damage window begins after 13 frames and ends after 23. Each swing can hit the ward once. Platforms are one-way surfaces, not solid walls. The visible guide overlay shows the actual collision geometry.

## Art integration

| Asset | Integration | Remaining work |
| --- | --- | --- |
| Abbey gate concept | Flattened full-scene backdrop | Separate parallax layers and remove painted ground from background layers |
| Bellwarden | Eight manually mapped poses; shared scale and foot pivots; mirrored for west-facing motion | Anatomical and costume consistency, walk-cycle cleanup, dedicated jump/fall/landing, native transparent exports |
| Masonry | Repeated 240-unit modules with narrow mortar joins | End caps, corners, variation, seam and lighting refinement |
| Brass ward | Procedural practice prop and hit flash | Designed enemy with behavior and reaction animation |

The character source PNG has an opaque magenta background. The browser removes that color at load time without changing the source file. Atlas rectangles have different widths to accommodate the extended sword. The character stands approximately 144 scene units tall. Source images are retained at their generated resolution.

The four-pose walk and three-pose attack establish timing and silhouette; they are not final animation. In particular, similar generated walk poses can appear to slide. Jumping temporarily reuses a passing pose. The backdrop still contains painted architecture and ground that are not collision surfaces. This pilot is suitable for judging visual direction and integration, not for accepting a finished environment kit.

## Validation

Simulation tests cover elapsed-time movement, takeoff direction, gap crossing, raised platform landing, falling/respawn, attack timing, single-hit behavior, facing, and delayed frames. Asset checks decode PNGs, verify dimensions and hashes, and verify frame rectangles and pivots. Chromium checks keyboard traversal and attack, reset, guides, touch movement/release, layout width, and browser errors. Screenshots are written to the ignored `tmp/` directory.

## Next production gate

Approve the Bellwarden silhouette and weapon, then clean the animation and export real alpha. Produce separate abbey scenery layers and a complete modular platform kit. Only then expand to an enemy encounter, pickup, and room transition.
