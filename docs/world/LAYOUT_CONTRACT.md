# Stage and room layout contract

Version 1 is a **proposed contributor interchange format**. The current encounter does not load it. A coding PR must implement and validate an adapter before claiming runtime support. JSON examples are planning data; do not silently plug them into the current fixed level.

## Coordinates and geometry

- Stage-local world units: x right, y down; reference viewport 1280×720. Stage `bounds` starts at (0,0). Room `origin` translates room-local data into the stage. Negative local coordinates require an explicit reviewed exception.
- `bounds` and `cameraBounds` are room-local rectangles `{x,y,w,h}`. Geometry must fit declared bounds. Camera uses viewport-aware clamping; a room smaller than the viewport needs an explicit centering/letterbox policy.
- Platforms are solid rectangles with explicit thickness, not inferred from artwork. Current main floor is y=600. Use main-route gaps ≤90, upward steps ≤100 and clear crawl height ≥90 as initial limits; test actual traversal. Current collision body is 120 standing /84 crouched, while standing artwork has nominal visible height 144. Avoid head-clearance assumptions based only on sprite height.
- Anchor `{x,y}` denotes hero feet on ground. Spawns/checkpoints need solid support, standing clearance and space away from hazards, enemies and closed mechanisms. Record expected facing. Do not bake camera position into player spawn.
- Placed art has `assetId`, local `position`, uniform `scale`, `pivot`, `layer`, and `collisionId` or null. Use a catalog ID when art exists. Missing assets stay explicit placeholders. Source pivots are pixels; layout positions are world units. Visible size = visible source bounds × scale, not whole-canvas size unless the contract says “cell.”
- Layers: sky/background, distant architecture, collision-aligned architecture, actors/props, restrained foreground. Name draw order, parallax factor, source alpha and seam policy. Parallax must leave collision-aligned edges at factor 1. Foreground must not obscure combat or landing tops.

## Connections and shared space

Connections live in stage `connections`, not duplicated independently in both rooms. IDs and room references are unique. Each connection declares destination spawn and activation conditions, including whether it is reversible.

- `seam`: adjacent continuous space. Exit and entrance anchors must agree exactly after origin transforms: `from.origin + exit = to.origin + entrance`. The camera and floor contact must continue without a hidden teleport. Vertical seams require matching both x and y. A ≤2px artwork-anchor tolerance is not permission for a mismatched gameplay seam.
- `portal`: explicit load/door/scene change. State the source anchor, destination anchor/facing and transition policy. Its rooms/stages do not have to be geographically adjacent. Holding interact cannot trigger repeat loops; loading clears stale velocity, pending strike and unsafe contact.
- A return cycle must land at the same previously assigned origins. Never spread rooms apart just to avoid visual overlap. If rooms deliberately share physical scenery, declare `sharedSpaceId`; one owner defines collision and persistent pickups so they cannot duplicate. Intentional source aliases do not create extra playable rooms.
- Stage portals are defined in `world-plan.json` as planned links. Accepted layouts replace unspecified destinations with actual room/spawn IDs. Menu/world-map icon placement is presentation and does not assert physical stage adjacency.

## Room records

Each room provides:

| Field | Meaning |
| --- | --- |
| `id`, `origin`, `bounds`, `cameraBounds` | Stable identity and placement |
| `spawns` | Named safe feet anchors/facings |
| `platforms`, `hazards` | Solid rectangles and explicit hazards; separately keyed |
| `checkpoints` | Spawn reference and proposed activation region |
| `art` | Catalog placements or labelled placeholders |
| `encounters` | Proposed enemy type, spawn, patrol/escape bounds and feature status |
| `interactions` | Mechanism/item IDs, activation regions, links and persistence scope |
| `routes` | Ordered main/optional route anchor IDs and return paths |

Use `status: planning-only` until integration. Enemy/interaction records declare `implementation: pending` unless the PR supplies code and evidence. Per-room state must be independent: defeated enemies, broken props, collected items and mechanism activation persist across visits/death within a run. Restart resets the run; reload persistence is a separate feature.

## Required mechanical checks

1. Parse JSON; reject duplicate IDs, unresolved references, invalid/nonfinite numbers and nonpositive geometry. Resolve art IDs against the catalog when not placeholders.
2. Check platforms, spawns and cameras against room/stage bounds. Check safe support/headroom and hazards at each entry/checkpoint with current body dimensions.
3. Validate both coordinates of every seam equation and every declared re-entry cycle. Check intentional shared-space ownership.
4. Confirm stage start can reach exit and optional branches can return. Graph connectivity alone is not proof of a traversable jump or lift: run actual controls through the blockout.
5. During integration, test transitions, camera clamps, respawn, interaction repeat prevention, pickup duplication and per-room enemy state. Follow the [existing transition brief](../ROOM_TRANSITION_BRIEF.md).

[Minimal two-room planning example](templates/stage-layout.example.json) shows a seam, route anchors and checkpoint. It deliberately uses no newly generated art, enemies or mechanisms. Extend it per chosen stage; it is not a complete schema validator or accepted Cloister map.
