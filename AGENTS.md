# Project workflow

- Read [docs/BUILD_STANDARD.md](docs/BUILD_STANDARD.md) before adding tests or a stage. It defines the test tiers and the runtime contract.
- Maintainer assistant changes: commit and push directly to main after appropriate validation. Do not open a PR for your own work unless explicitly asked.
- Outside contributors: submit PRs. Read [docs/WANTED_ASSETS.md](docs/WANTED_ASSETS.md) first — most single-pose images cannot be integrated. Art tasks and exact prompts are in docs/art-jobs/README.md.
- Every stage moves the player through `prototype/physics.js`. Do not copy a `step()` into a new stage; register the stage in `test/runtime-contract.test.mjs` instead.
- Preserve every submitted original image, metadata file, prompt and variant, even when unused. Never overwrite a locked source; use versioned derivatives.
- New image generation is budget-sensitive. Prefer the retained library and contributor briefs; do not generate additional art merely to polish a gameplay fix.
- Run `npm test` on every change. Add `npm run test:stage` when a stage, renderer or runtime art changes; `npm run test:art` and `npm run validate:assets` when art files change; `npm run test:route` before a release or after movement/combat changes.
- A test must name the defect it catches. Do not capture screenshots nothing compares.
- Never draw a game object as a coloured box. Flat rectangles are for UI and debug only, and the runtime contract test enforces it.
- CI runs every tier on each push and pull request. Do not merge red.
