# Job 06 — layered gate and stone decorations

Priority: after pickup alpha and character continuity. References: art/production/abbey/abbey-gate-portal-v001.png and masonry-module-v001.png. Preserve originals.

## Copyable prompt

> Produce an original Gothic abbey doorway kit for Ashen Vesper matching the supplied weathered blue-gray stone and aged iron. Strict orthographic side-scroller elevation, HD painted non-pixel materials, cold moonlight. Separate transparent layers: stone arch/frame with transparent doorway opening; complete iron portcullis; stone sill. Preserve material scale and chipped edges. No backdrop painted into doorway, sky, floor plane, vignette, shadow rectangle, checkerboard, text or glow. Empty gaps between bars genuinely transparent. Frame/gate/sill share door center and ground anchor. Complete silhouettes with 16px transparent padding. Never flatten layers together.

## Contract and tests

Three separate 1024 × 1280 RGBA PNGs, shared ground anchor (512,1216), doorway approximately x=288..736/y=320..1216; record exact attachments and opening bounds. Runtime whole frame 260 × 320. Uniform scale and same canvas origin. Separate untouched sources and derivatives with hashes, prompts, attempts and limitations. A montage is reference, not a completed layered kit.

Show layers individually over white/black/blue and assembled over the abbey. Door and bar gaps must reveal background. Open/close preview stays aligned to sill. Integration retains ember and guardian rules; visual opening cannot bypass collision before success. Check narrow viewport and overlapping actors for opaque halos. Run general gameplay, preservation and browser checks.

Optional railing/pillar cleanup is a separate bounded PR: clear pierced openings, declared layer order/anchor/runtime size, no decorative collision added invisibly.
