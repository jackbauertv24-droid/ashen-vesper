# Maintainer review — PR 42

**Fix gameplay glitches: Cistern transition drowning trap, gate teleport,
and enemy patrol snaps: accepted, rebased onto current main.**

The first contributor pull request against the runtime rather than the art
library. Five real defects, each with a test, and one of them was mine.

## Verified independently

| fix | verdict |
| --- | --- |
| Cistern entrance spawn at y=600 when the ledge is at y=420 | **real, and my fault.** I moved the entrance when the stage was rebuilt vertically and never updated the room graph. Entering from the Cloister dropped the player 180 units into open air. Confirmed fixed: entry now lands grounded at y=420 with no deaths over three seconds. |
| Closed gate teleporting the player across the map | **real.** `s.x = Math.min(s.x, LEVEL.gate - 36)` applied from either side, so returning from the Cistern at x=3950 snapped the player 1,246 units back through a shut portcullis. The fix uses the frame's previous x to make it a directional collision. Confirmed: the player now stays at 3950. |
| Enemy snapping up to 250 units when it disengages | **real.** Patrol assigned the sine position outright rather than walking toward it. Now speed-clamped to the same 78 units per second the approach uses. |
| Sprinting and attacking during the hurt recoil | **real.** The recoil pose played while the player ran at full speed and could swing. Horizontal drive, jumping, air steering, turning and new attacks are now locked for the 0.35s. |
| Collected drops never culled below the kill plane | **real**, and not in the summary. A dropped ember that fell out of the world stayed in the list forever. |

## Why it was rebased rather than merged

The branch was cut from `10e8586`, before the Cistern's pits were closed. A
straight merge would have reverted the solid stair, the full-width basin and
the raised low route, and deleted the three guards added with them —
`cannotReach()`, the fall survey and the headroom check. Those exist because
that stage previously contained a pocket the player could not climb out of;
losing them to a stale branch would have been a poor trade for five fixes.

Rebasing applied cleanly with no conflicts, and both sides survive: the
geometry and guards are intact, and all five fixes are present. All five test
tiers pass, and the two transition fixes were re-verified by driving the room
graph directly rather than trusting the branch's own tests.

## Note for contributors

Rebase before submitting, or say which commit you built on. This branch was
four commits behind on a file it rewrote, and the diff read as deliberate
deletions of new safety tests when it was only staleness.
