# Maintainer review — PR 40

**Job 12 Iron Sexton 8-pose motion sheet, hurt shovel restored (v005):
selected. The blocking defect is fixed.**

All originals, exports, prompts, notes, metadata and review composites are
retained and locked. Maintainer image-generation attempts: zero.

## What was wrong, and what changed

[The PR34 review](PR_34_38_REVIEW.md) rejected v004 for integration because
its `hurt` cell had no shovel at all: the detached blade fragment from v003
had been removed by deleting the whole weapon, so the Sexton's shovel would
have vanished on every hit and reappeared on recovery.

Measured independently against v004, cell by cell:

| cell | v005 parts / mass | v004 parts / mass | delta |
| --- | --- | --- | --- |
| r0c0–r1c2 (7 cells) | 1 / unchanged | 1 / unchanged | **0** |
| r1c3 `hurt` | 1 / 64,762 | 1 / 47,859 | **+16,903** |

Detached fragments across all eight cells: **none**.

This is exactly the right shape of fix. The seven good cells were carried
over byte-for-byte rather than regenerated, and only the broken one was
redone. The restored `hurt` mass of 64,762 px matches the v003 body that
held the shovel correctly, with the 2,576 px floating blade fragment gone —
so the weapon was reattached rather than redrawn. Visual inspection confirms
the shovel is present, crossing the body with both hands in contact.

The earlier corrections still hold: zero detached fragments anywhere, and
the distinct walk cadence measured at 68.9% silhouette difference between
step-a and step-b.

## Status

**Selected prototype, not yet runtime integration.** The Ruined Cloister
still reuses the Hollow Pilgrim motion set for its enemy. Replacing it is
M2.1 in [the milestone queue](NEXT_MILESTONES.md) and needs the behaviour
work — bait, miss, recovery, wall handling and physical shovel contact —
not just the sheet. The art side of M2.1 is now unblocked.
