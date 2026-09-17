# Job 11 — Bell Moth Flying Enemy (v001 Design Reference)

- Asset: Original Gothic Bell Moth flying enemy design reference candidate for Ashen Vesper.
- Generator tool: DeepMind Agent Image Generation (`imagen-3.0-generate-002`).
- Generation attempts: 1 attempt generated and recorded.
- Original generator output: `source/bell-moth-generated-v001.png` (1024 × 1024 PNG, SHA-256: `2727381b36e1b0e12c1cffa81748a73df4d953575f415489bdbe7ef0028ea2f5`).
- Export deliverable: `exports/bell-moth-v001.png` (1024 × 1024 RGBA PNG, color type 6, SHA-256: `5ca014e8e3ddafb258f9c3895638c6594af4765a0093e59fb8f358f3affca06e`).
- Visual review evidence: `docs/reviews/bell-moth-v001.png` (1400 × 950 PNG, SHA-256: `eab0536de1aa6f3a7181d929d446e55e2e6f7aa0c2498ca1f86cd8321e2f28cf`).
- Quota / Cost: Standard AI Agent generation quota; exact monetary cost unknown.

## Design and Style Alignment
- Subject: Ragged nocturnal moth with tattered slate-indigo wings, pale worn wing vein markings, two restrained glowing amber eyes, and a weathered cracked bronze bell husk suspended beneath its abdomen by cord.
- Silhouette & Readability: Clean orthographic side profile, facing right. Bilateral silhouette verified under horizontal mirroring. Bell and abdomen hang naturally beneath body core.
- Gameplay Role: Intended for Ruined Cloister (Screen 2: Broken Arcade) as an airborne threat prompting aerial sword attacks and evasive jump timing.

## Technical Contract Verification
- Contract Brief: "Design first: one 1024 × 1024 RGBA reference, subject approximately 640px wingspan, center (512,512)."
- Dimensions: 1024 × 1024, PNG Color Type 6 (True RGBA).
- Subject Wingspan: Exactly 640 px (`minX=192, maxX=831`).
- Subject Center: `x=511.5, y=511.5`, centered exactly on declared pivot `[512, 512]`.
- Outer border clearance: 100% Alpha 0 on all 32px borders (0 violations) and 12px cell padding.
- Runtime scale: Uniform 0.2 scale to 64 units wingspan.

## Export Methodology
1. Generator produced an isolated high-contrast render.
2. Background identified using 4-edge connected border flood-fill, preserving all internal pale wing markings, fur highlights, and eye glows at full opacity.
3. Sub-pixel anti-aliasing computed with unmultiplied color preservation to prevent white/dark fringing.
4. Scaled to nominal 640px wingspan and centered on 1024 × 1024 canvas at pivot `(512, 512)`.

## Acceptance & Engine Status
- Status: `candidate` (Design Reference)
- Six-frame animation sequence (`hover-high`, `hover-low`, `warn`, `swoop-start`, `swoop-contact`, `climb`) and flying AI flight path/combat state logic will be implemented in subsequent phases following maintainer direction.
