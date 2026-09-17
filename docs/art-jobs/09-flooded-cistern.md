# Job 09 — Flooded Cistern map kit

Priority P2, after Cloister mechanisms work. Underground waterworks: low stone vaults, oxidized iron, reflected amber valve lamps. Water is initially scenery/hazard; swimming is not part of this brief.

## Copyable prompts

> Paint an original Gothic abbey cistern environment reference for Ashen Vesper, strict side-on HD non-pixel game view: vaulted slate stone, damp limestone ledges, old iron sluice gates, dark still water below the main route, sparse amber lamps and readable valve machinery. Keep floor/ledge silhouettes crisp, restrained reflections below traversal, distant vaults subdued. No characters, HUD, text, heavy mist over floors or copied layouts.

For each production asset:

> Create ONE [vault pier / damp platform cap / sluice frame / water-surface strip] matching the supplied Ashen Vesper cistern reference and retained stone scale. Orthographic side-scroller painted HD art, cool damp stone, oxidized iron, small amber accents. Genuine alpha around the complete silhouette and through empty openings. No full-room backdrop, checkerboard, text, glow rectangle or cast ground shadow. Surface must be readable behind actors. Export separately; do not merge water, wall and walkable ledge.

## Contract and tests

Concept reference: 2048 × 1024 opaque PNG, explicitly non-tileable until tested; it is not a complete playable map.

Plan four horizontal screens, 5120 × 720, current movement dimensions. Layout marks safe main path, optional low passage, two valve links, lift endpoints and checkpoint. Main gaps at most 90 and steps at most 100. Water hazard bounds are explicit gameplay data, never inferred from painted reflections.

First asset PR: damp platform cap 1024 × 256 RGBA, runtime 240 × 60, top y=32; vault pier 1024 × 1024 RGBA, runtime 240 × 240, ground pivot (512,960). Water strip later: 2048 × 256 RGBA, runtime 1024 × 128, baseline local y=64, three-copy seam evidence if tileable. Background stone may be opaque only when explicitly a full background layer.

Show normal and grayscale layering, clear floor contact, no opaque water rectangle covering actors. Test normal source-over on black/white/blue and abbey reference. Runtime water/lift/valve behaviors need their own tests and label implementation status. No swimming, buoyancy, breath meter or changed jump tuning introduced incidentally.
