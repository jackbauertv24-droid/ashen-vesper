# Crouch candidate v001

- Generation attempts: **1**, using the built-in `image_gen` tool. No correction generation or API fallback.
- Exact prompt: [PROMPT.txt](PROMPT.txt). Character reference: `art/production/bellwarden/bellwarden-pilot-v001.png`.
- Provider model identifier, metered tokens, quota debit and monetary cost were not exposed by the tool; these values are unknown, not zero.
- Original: `source/crouch-generated-v001.png`, copied unchanged from the tool output. SHA-256 is recorded in `art/manifest.json` and `art/library/submissions.lock.json`.
- Six anatomically crouched poses replace vertical scaling of the standing sprite. Runtime scale is uniformly 0.215 in both dimensions, with per-pose ground anchors. The rendered height is about 72 units.
- **Production contract failed:** RGB with baked checkerboard, inaccurate cell packing, thrust crossing a cell boundary, and variable sword length. This is a prototype candidate, not a compliant transparent export; no `ready-for-review` claim or production submission validator pass.
- Integration: border-connected neutral checkerboard mask in browser canvas, source-blade protection polygons, reviewed silhouette crops and ground anchors. The original file is never rewritten. Sparse crawl poses and edge masks still need refinement.
- Visual evidence: `node tools/pose-check.mjs` captures all six runtime crouch poses and the retained enemy motion poses. Also play the demo in both directions, crouch under the arches, and check low attack contact. Automated collision tests do not establish visual quality.
- The new crouch collision height is 72; low arch clearance is 80. No extra generation was used for the enemy: its retained whole-body motion sheet replaces the prior rigid crop and detached staff.
