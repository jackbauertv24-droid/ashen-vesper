# Job 15 — lever, grate and counterweight lift

Priority P1 for lever/grate, P2 for lift. Separate stateful props and moving pieces. Use the retained gate's iron/stone style; choose one mechanism per PR.

## Lever prompt

> Paint two states of the same original Gothic abbey lever for Ashen Vesper: worn iron housing on a small limestone plinth, aged-brass handle in inactive upper angle and active lower angle. Same camera, scale, plinth, hinge and materials. Strict orthographic side-on HD non-pixel game prop, genuine alpha, no scene, ground shadow, text, checkerboard or glow box. One 1024 × 512 sheet with two 512 cells, fixed ground pivot (256,464), hinge local (256,280), 12px clear cell padding. Handle rotates around that hinge; base never shifts.

## Grate/lift prompt

> Create ONE complete [iron grate / stone-and-iron lift deck / bronze counterweight / chain segment] for Ashen Vesper, matching supplied weathered abbey iron and limestone. Strict orthographic game elevation, HD painted non-pixel, true alpha through openings and around silhouette. No full-room backdrop, text, checkerboard, shadow plane or haze. Keep attachment sockets clear and recorded. Export separate moving objects; never flatten the lift, chains and weight together.

## Contract

Lever as above, names inactive/active, runtime cell 64 × 64. Grate 1024 × 1280 RGBA/runtime 128 × 160/shared sill pivot (512,1216), openings actual alpha. Lift deck 1024 × 256 RGBA/runtime 240 × 60/top contact source y=32; chain 256 × 1024/runtime 16 × 64 with attachment endpoints; counterweight 512 × 512/runtime 48 × 48/pivot (256,64). 12px padding for non-tiling silhouettes. A chain tiling claim needs explicit endpoints and three-copy seam evidence.

## Behavior and acceptance

Lever proposed E interaction when nearby, one connected grate, activation retained across death in a run. Show actual closed/open states and a visible link; no invisible collision after the painted grate leaves. Keep interaction readable and avoid accidental repeat toggles.

Lift is a later gameplay PR: declared path/endpoints/speed, carries the grounded player, permits jumping off, resolves solid sides/underside, safe reversal with no silent crushing or wall teleport. Keyboard/touch/gamepad interaction and respawn positions need tests. Pause/moving preview proves alignment; a static kit alone does not prove platform behavior.

Show actual runtime size with hero, black/white/blue/abbey composites, complete pierced gaps and anchored movement. Include state/attachment/collision metadata, source/export hashes, prompts and attempts, plus general preservation/gameplay/browser checks.

## Current review

PR 15 lever is retained with preservation incomplete: notes report two attempts, but only one original is supplied. Supply the missing attempt and exact prompt without generating again. Gameplay/grate integration remains pending. See [PR 15–17 review](../PR_15_17_REVIEW.md).
