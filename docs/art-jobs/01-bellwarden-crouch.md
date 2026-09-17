# Job 01 — Bellwarden crouch and low attack

## References

Primary: `art/production/bellwarden/bellwarden-pilot-v001.png`. Use its short ivory shoulder mantle, tied dark hair, midnight-blue split coat, brass fittings, gloves, boots and straight arming sword. The airborne sheet's long cape is not the costume reference.

## Copyable generation prompt

> Create production animation artwork for Ashen Vesper's original Bellwarden, matching the attached existing protagonist exactly. HD hand-painted non-pixel Gothic action-platformer art. Strict right-facing side profile, fixed orthographic camera, constant anatomy, scale and lighting. Short ivory shoulder mantle, tied-back dark hair, midnight-blue split coat, aged brass fittings, fitted gloves and boots, one straight arming sword. Six distinct crouching poses in reading order: stable crouch idle; low crawl contact A; low crawl contact B; low sword thrust anticipation; low horizontal sword thrust contact; crouched recovery. Bend hips and knees anatomically; do not vertically squash a standing person. Weight stays near the same foot/hip anchor. Sword stays in the same hand and keeps the same length. The attack travels low and horizontally. Transparent background with real alpha; no ground, cast shadow, labels, checkerboard, colored key backdrop or extra figures. Maintain clear negative space and preserve all weapon tips and cloth. Follow the supplied grid and anchor specification; no pose overlaps another cell.

## Export contract

- One 1536 × 1024 RGBA sheet, 3 columns × 2 rows of 512 × 512 cells.
- Names: `crouch-idle`, `crawl-a`, `crawl-b`, `low-windup`, `low-contact`, `low-recovery`.
- Shared anchor: (192,464), virtual standing height 384px, runtime standing reference 144 units (scale 0.375).
- Crouched head should be near source y=240; soles y=464. Target height about 224px, or 84 runtime units. Keep natural bent knees with unchanged head and torso proportions. Earlier 56/72-unit targets are superseded by the measured calibration in docs/CROUCH_ALPHA_REVIEW.md.
- Contact sword extends rightward from the body. Match the current low attack region: x=8..115, y=-64..-7 relative to player feet. Keep tip at least 4px from the cell edge.
- Idle is held. Crawl A/B alternates at a pace appropriate to 85 world units/second. Attack uses 0.14s anticipation, 0.16s contact, 0.12s recovery (0.42s total).

## Job-specific tests

Show the low pose inside a 90-unit-high passage with feet stable at the floor. Releasing crouch under its ceiling must not show a standing pose. Show left/right crawl, crouched attack, and transition back to idle in open space. The low attack must visibly line up with the guide box; no sword teleport between frames. See the shared checklist and submission validator.

An initial candidate is retained in `art/contributions/01-bellwarden-crouch/v001/`. It supplies runtime poses through custom masking/crops but fails the strict alpha and grid contract. Future submissions should improve those exports and crawl continuity; preserve the candidate.
