# Job 04 — brazier alpha polish

Priority: follow-up. Initial real-alpha cutout is integrated in art/contributions/04-brazier-alpha/v001/. Preserve that and the old original; prefer cleanup/export over another generation.

## Copyable prompt

> Use the supplied Ashen Vesper hanging brazier as the only design reference. Produce one clean orthographic painted HD Gothic prop cutout. Preserve iron mount, three chain runs, ornate bell censer, cool iron, aged brass and contained amber fire. True RGBA transparency: exterior and empty chain/ironwork gaps clear. Preserve metal and intentional interior flame. Remove studio backdrop, exterior glow haze, ground shadow and matte contamination. No scene, checkerboard, text, border, loose particles or extra ornaments. Keep complete mount tips and chains inside 1024 × 1024 with 16px transparent padding. Center horizontally; mount anchor (512,32), bottom near y=992. Light spill belongs in a separate effect.

## Contract and tests

One 1024 × 1024 RGBA PNG, runtime 84 × 100, mount anchor (512,32), actual opaque bounds recorded. Original output and cleaned export must be separate versioned files. Current v001 is actually 1254px and must not be overwritten.

Normal source-over composites over black/white/saturated blue/checkerboard/abbey at source and runtime scale. Check chain holes, mount tips and antialias edges at 4× zoom. Outer 16px alpha zero; no veil or opaque matte. Show the prop over sky and masonry in the game, then break it and verify one collectible. Run gameplay, asset preservation and gallery/browser checks. Include exact prompt, attempts, hashes, dimensions, alpha samples and limitations.
