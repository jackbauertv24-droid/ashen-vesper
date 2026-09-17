# PR 12 — ember alpha review and integration

Decision: merge, preserve and integrate the supplied RGBA export for the encounter pickup. It replaces the provisional warm-color separation; runtime uses normal source-over with the same 54 × 54 canvas, falling physics and collection rules.

## Verified

- PNG is 1024 × 1024, color type 6. All outer 32px border pixels have alpha zero.
- Every visible pixel lies inside x=256..768, y=160..864. Actual nonzero-alpha bounds are x=322..688, y=190..744, including antialias pixels. Submitted bounds x=323..687, y=191..744 exclude a thin edge and are superseded by these measurements.
- Source and export SHA-256 match their catalog entries. All available submitted resources are retained byte-for-byte.
- Export preserves engraved bronze and has a compact flame silhouette. Review over white, black, blue and abbey at runtime scale shows no rectangular backdrop. Fine edge quality remains a visual consideration; RGBA alone does not prove a perfect matte.
- Contributor preview is standalone; existing gameplay checks did not initially exercise the new asset. Maintainer integration and the updated runtime pose/prop review supply that missing evidence.
- The contributor's border test sampled eight points. Maintainer verification and strengthened test check the entire 32px perimeter and visible envelope.

## Retention follow-up

NOTES.md reports two generation attempts, but only the corrected second output is included. The failed checkerboard first attempt must be added in a follow-up if available, alongside its exact correction prompt. It has not been silently discarded by the maintainer; it was absent from the submitted files. Preserve it as a rejected variant rather than overwriting the corrected source. Cost and quota figures remain unknown as recorded by the contributor.

No maintainer image generation was used for this review or integration. The older source and provisional compositing module remain retained for history.
