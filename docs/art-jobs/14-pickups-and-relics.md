# Job 14 — useful pickups and relics

Priority P1 for healing vial; P2 for seal fragment; P3 for optional currency/HUD. Choose one item per PR. New pickup art does not implement an inventory or economy.

## Copyable prompts

Healing vial:

> Paint one original Ashen Vesper healing vial: small aged-brass cage around dark red glass, worn ivory stopper, restrained readable highlight, Gothic handmade materials matching supplied bronze ember and hero fittings. Orthographic side-view HD non-pixel game pickup, compact complete silhouette. True transparent alpha, no studio backdrop, ground shadow, haze, checkerboard, text, UI frame or sparks. Center object on 1024 × 1024, within x=256..768/y=192..832, pivot (512,768). Red glass is intentional object transparency, not a translucent canvas veil.

Seal fragment:

> Paint one original broken limestone seal with a small aged-brass spiral inset for Ashen Vesper. Distinct from its flaming bronze ember: cold stone, no fire, readable missing wedge, restrained moonlit edge. Orthographic HD painted pickup, complete silhouette, true alpha, no backdrop/shadow/text/checkerboard/wide glow. 1024 × 1024, same declared center/pivot and bounds as the healing vial. No key shape or emblem copied from a franchise.

Optional coin token:

> Paint one small original weathered bronze abbey token with a simple indented bell mark, no readable text, no flame, orthographic HD painted pickup. Same true-alpha canvas/bounds/pivot contract. Use subdued brass so it cannot be confused with the ember required at a gate.

## Contract and behavior proposals

Single 1024 × 1024 RGBA source/export per chosen item, outer 32px alpha zero. Metadata path/hash/visible bounds/pivot (512,768)/runtime canvas 48 × 48. Existing ember display scale is not a reason to fill the entire canvas with this item.

Healing proposal: one carried vial maximum, restore 2 HP up to 5, consume once with a dedicated use action. No wasted use at full health. Choose visible keyboard/touch/gamepad bindings in a separate gameplay PR; do not overload attack/interact silently.

Seal proposal: a named one-use route key opening one declared shortcut; persist key and opened route across death within a run. It does not replace current ember gate rules. Economy/currency remains undecided; token is candidate-only until a coherent use exists.

HUD icons should be simple vector/code-native derivatives of selected silhouettes: 32 × 32 with 16px preview, accessible text labels, no raster text. This does not need another image generation.

## Acceptance

Normal source-over over black/white/blue/abbey, source and 48px runtime. Clear silhouettes in grayscale and distinction from ember/debris. Show transparency through intentional glass and zero alpha outside bounds. Gameplay integration tests collect-once, inventory cap, healing cap/consumption, death persistence, full-health behavior and all input types. Item art alone must say inventory/use-action pending.
