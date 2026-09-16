# Asset specification — v0.1

## Status model

- `concept`: visual exploration; not an engine asset.
- `in-production`: being separated, cleaned, animated, or integrated.
- `validated`: passed the checks for its intended engine use.
- `superseded`: kept for history but replaced by a newer revision.

Do not label a flattened concept as layered, tileable, transparent, or production-ready without checking the delivered file.

## Files

- Use lowercase descriptive filenames with explicit revisions: `abbey-gate-concept-v001.png`.
- Retain full-resolution PNG masters. Use sRGB color where supported.
- Preserve genuine alpha on transparent exports; a checkerboard painted into RGB is not transparency.
- Keep art and collision separate.
- Record actual dimensions, alpha availability, and SHA-256 in `art/manifest.json`.
- Record intended use and outstanding validation for each asset.

## Production targets

Initial composition target: a 16:9 side-scrolling viewport. Final engine scale and export sizes will be selected after the first gameplay readability test; generation dimensions are not yet engine specifications.

For each character frame, record bounding box, foot pivot, facing, duration, and action. Keep contact points consistent. Attachments and hitboxes are separate metadata, not inferred from a painted shadow or weapon trail.

For each modular environment piece, record attachment points, dimensions, collision outline, parallax layer, and whether horizontal repetition was tested. Keep foreground occlusion off critical platform edges.

## Validation checklist

- Opens and decodes correctly.
- Catalog dimensions and hash match the actual file.
- Required alpha and padding are present.
- Readable at the intended gameplay scale.
- Lighting and proportions match the approved reference.
- No clipped motion, shifting pivots, or inconsistent equipment across frames.
- Layer seams and repeat edges checked where applicable.
- Status and limitations accurately recorded.
