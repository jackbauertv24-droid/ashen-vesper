# PRs 15–17: mechanism and enemy reference review

## Decisions

- **PR 15 / Job 15 lever:** retain the useful two-state prototype, with preservation incomplete. Its notes report two generation attempts (sheet test and isolated master), but only one source PNG and one prompt are supplied. Contributor follow-up must include the missing original/variant and exact per-attempt prompt; do not regenerate it. The included source, export, metadata and evidence remain byte-identical. Grate linkage, proximity interaction, persistence, keyboard/touch/gamepad bindings and collision are not implemented.
- **PR 16 / Job 12 Iron Sexton:** selected prototype design reference for eight-pose motion. Broad armor and shovel distinguish it from the pilgrim. Both hands and weapon remain visible. Mild three-quarter depth needs consistent treatment in motion; flipping does not prove anatomically correct bilateral animation. No combat AI or motion is supplied.
- **PR 17 / Job 13 Cistern Lurker:** selected prototype design reference for six-pose motion, subject to low-target alignment before gameplay acceptance. Connected root limbs and amber grille fit the cistern direction. Record and preserve limb count in every pose. No crawling/lunge behavior is supplied.

## Findings and corrections

Original v001 files and contributor review PNGs remain locked. New v002 previews and runtime metadata supersede their scale claims:

- **Lever:** 512px cell rendered at 64px is correct. Visible inactive height is about 46 units; hinge is 23 units above ground, so the notes' “waist-height” claim is unsupported. Original hero comparison used a partial 160×220 crop rendered at 120px. v002 uses the catalogued idle frame and actual 144/418 anatomical scale. A prompt and proximity indication will be needed for readability.
- **Sexton:** source visible height 898px. Original preview used 175px despite the runtime label 160; its hero crop also differed from the runtime frame. v002 uses 160/898 uniform scale, correct idle-frame crop and shared floor anchoring. Metadata grip/tip points are reference guides, not validated attack contact. Whole shovel length is not reach from the forward hand; actual attack hit geometry must follow the blade during motion.
- **Lurker:** bounds 942×506px. Original preview used a 140px visible width while labelled 96×48. Uniform scaling to width 96 gives height **51.57**, not 48; v002 records this without squashing the artwork. Future motion can target nominal 320×160 but must preserve proportions or explicitly document a reviewed anatomy change. Original “low attack” comparison drew a standing attack-extension frame at 120px and an unrelated line 35px above ground. v002 shows standing hero scale and removes that line. Core center is about **33.83 units above ground** at this scale. Current crouched attack simulation spans 64 to 7 units above ground, but rectangle overlap alone cannot prove visible blade contact. Require actual selected crouch poses, blade/core overlays and hit/miss tests in the future integration.

Exports have real empty exterior alpha and readable cutouts on the supplied composites. Segmentation from solid backgrounds is reported by the contributor; this is not native generator alpha. Dark edge quality still needs observation against the final room lighting. The lever base-identity test checks an unoccluded region, not every occluded gear pixel; its passing result supports alignment without certifying the entire assembly.

## Preservation and usage

All three submissions' original sources, exports, prompts, notes, metadata, preview pages and evidence are retained and hash-locked. Shared catalog/gallery/test append conflicts were resolved by retaining every asset and each new check. No resource was replaced or discarded. The absent lever attempt cannot be preserved until supplied.

Contributor reports: lever two generation attempts; Sexton one; Lurker one. These are reported counts, not independently measured billing. Monetary cost is unknown. Maintainer review used **zero image-generation attempts**.

## Validation

Combined unit tests: 34 passed. Asset validation: 41 images and 91 preserved resources. Browser previews and full encounter route checked; corrected enemy previews also measure actual rendered silhouette bounds with hero and guide overlays hidden. Selection is permission to reuse these references for the next motion submissions; it does not mean they have been added to the playable demo.
