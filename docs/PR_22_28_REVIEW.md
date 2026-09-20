# PRs 22–28: world module review

## Decisions

- **PR 22 grate:** selected and integrated at the existing Pilgrim Road gate. It renders128×160 with source pivot (512,1216) aligned to floor; opening removes that overlay to reveal the pre-existing raised-gate painting while existing collision/state remains authoritative. Lever linkage and travel animation are not implemented.
- **PR 23 damp cap:** retained Cistern material candidate. Decorative end corbels repeat at every join, so the submitted three-copy image does not establish a production seam. Make a central repeat strip plus separate end caps before runtime selection.
- **PR 24 lift deck:** selected visual prototype. The preview illustrates travel but supplies no carrying, reversal, underside, crush, camera or respawn code. Implement behavior with blockout art before generating chain/counterweight variants.
- **PR 25 tower landing:** selected visual prototype. It is suitable for static landings after vertical camera and stage layout work. No new collision/camera implementation is included.
- **PR 26 niche panel:** retained background-decoration candidate. Generated pseudo-lettering in the lower inscription conflicts with the no-lettering brief; remove it in a versioned derivative or obscure it with an intentional original relief. It is not collision or a door.
- **PR 27 bronze bell:** selected Bell Tower landmark prototype. Hanging support, collision/interaction, sound and boss relationship remain separate. Preserve its cutout; do not generate another bell until layout establishes need.
- **PR 28 vault pier:** selected Cistern architecture prototype. The attached lantern makes repeated piers visually identical and may duplicate lights; provide an unlit pier derivative and separate lantern before kit assembly.

All source JPEGs, PNG exports, prompts, notes, metadata, previews and review evidence are preserved. Shared catalog/gallery/test conflicts were merged by union. Contributor-reported attempts/costs remain in original notes; maintainers used zero image generation.

## Demo and validation

Only the grate is integrated because it maps to existing tested gate behavior. Other modules depend on maps or systems not present in the demo. Passing the current encounter does not prove lifts, stairs, vertical cameras, water hazards or stage transitions.

Combined verification passed: 47 unit and visual-contract tests; 77 catalogued image dimensions and hashes; 171 original submission resources preserved byte-for-byte; the complete playable encounter route; and every retained gallery and contribution preview in a headless browser.
