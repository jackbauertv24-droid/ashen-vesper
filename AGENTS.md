# Project workflow

- Maintainer assistant changes: commit and push directly to main after appropriate validation. Do not open a PR for your own work unless explicitly asked.
- Outside contributors: submit PRs. Art tasks and exact prompts are in docs/art-jobs/README.md.
- Preserve every submitted original image, metadata file, prompt and variant, even when unused. Never overwrite a locked source; use versioned derivatives.
- New image generation is budget-sensitive. Prefer the retained library and contributor briefs; do not generate additional art merely to polish a gameplay fix.
- Test gameplay with npm test and npm run test:encounter. Verify preserved resources with npm run validate:assets. Use npm run test:browser when the original study or gallery changes.
