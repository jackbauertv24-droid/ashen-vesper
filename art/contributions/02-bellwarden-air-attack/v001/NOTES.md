# Bellwarden Aerial Sword Attack Candidate v001

- Generation attempts: **1**, using the built-in `image_gen` tool. Single-pass generation with no correction cycle or external API fallback.
- Exact prompt: [PROMPT.txt](PROMPT.txt). References:
  - Primary costume & anatomy: `art/production/bellwarden/bellwarden-pilot-v001.png` (short ivory mantle, midnight-blue split coat, brigandine, arming sword).
  - Motion exploration reference: `art/production/bellwarden/bellwarden-airborne-v001.png`.
- Provider model identifier, metered tokens, quota debit and monetary cost were unmetered/not exposed by the execution environment; recorded as unknown.
- Original generator output: `source/air-attack-generated-v001.png` (1264 × 848 PNG, SHA-256: `eb7792cea7664c6d605d2e6d549c8c956542ceda5b09b7c2e6a7ec022210b4a1`).
- Exported production sheet: `exports/air-attack-v001.png` (1536 × 1024 RGBA PNG, SHA-256: `a42c03592cdef788b2ccf076f17449cc43da3bfb9e7dbf6106dad5891818db76`).
- Six airborne combat frames packed into a 3 × 2 grid of 512 × 512 cells:
  1. `air-windup-a` (col 0, row 0): upward leap with sword raised overhead.
  2. `air-windup-b` (col 1, row 0): tucked flight posture with blade drawn horizontally back.
  3. `air-contact-a` (col 2, row 0): forward horizontal thrust impact pose.
  4. `air-contact-b` (col 0, row 1): forward follow-through thrust.
  5. `air-recovery-a` (col 1, row 1): recovery posture with angled guard.
  6. `air-recovery-b` (col 2, row 1): descending recovery with vertical low blade guard.
- Shared virtual feet anchor: `(192, 464)`, standing reference height 384px, runtime display height 144 units.
- Boundary compliance: Every pose maintains >= 4px fully transparent border padding around its 512 × 512 cell.
- Weapon reach: Forward contact extends to dx = 315 relative to virtual feet (approx. 118 world units at runtime scale 0.375, matching the brief's x=8..115 range).
- Structural validation: Passes `node tools/validate-art-submission.mjs art/contributions/02-bellwarden-air-attack/v001/submission.json`.
- **Honest status report:** Submitted as `status: candidate`. The original generation produced a dark-blue studio backdrop rather than native transparency; alpha extraction cleanly separated silhouettes using chromaticity and floodfill without degrading dark armor or hair, but maintainer visual review is required for motion fluidity and timing integration.
