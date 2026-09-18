# PRs 18–21: boss and environment review

## Decisions and demo changes

- **PR 18 / Job 16 Tollkeeper:** retain design candidate. Bronze harness, core and vestments fit the theme. The pose grips the staff with one hand; the brief requires a two-handed weapon. It has mild three-quarter depth. Do not generate motion yet: supply a consistent two-handed reference or a documented design revision first. No boss AI/arena/contact is implemented.
- **PR 19 / Job 08 arcade arch and pier:** arch selected and integrated as faded distant architecture in Pilgrim Road, parallax0.35, behind all actors. Pier retained as decorative prototype. True pierced openings pass the tests. This is scenery, not collision or a connected Cloister stage. The provided arch already includes columns; adding the separate pier does not prove a socket-compatible assembly.
- **PR 20 / World 01 stair flight:** retain alternate shallow stair candidate. Actual sockets (64,960) →(960,394) imply run224 and rise141.5 at0.25, not the requested224 rise. Reported126.25 measures tread-top rise separately from the footing socket. No stair runner is currently implemented; statements about a world collision runner should be treated as future integration. Do not resize the baseline geometry to fit this export silently. A socket-compatible224-rise variant remains needed where that contract applies.
- **PR 21 / World 02 platform cap:** selected as prototype floor material and integrated into Pilgrim Road. Whole canvas240×60 includes transparent margins; visible cap span210. Original cap repeats have bevelled ends, so full-canvas repetition or socket continuity does not prove an opaque continuous slab underneath. Runtime uses central source crop (192,32,640,183), scale240/1024, repeat150, with painted top exactly at platform collision y. Existing masonry supplies the solid body below. Original source/export remain untouched; crop parameters are in prototype/environment-metrics.js. Exposed end/corner variants and repeat texture polish are future improvements.

Collision platforms, movement and encounter state remain unchanged. The existing demo is still Pilgrim Road; no new map, enemy, stair behavior or boss is claimed. No image generation was used for review/integration.

## Measured acceptance gaps

- Boss preview multiplies220/921 by1.5 despite its runtime label. Contributor evidence labels the hero128, while current nominal hero artwork is144; the220/144 ratio is1.53, not1.72. Its breathing effect scales the entire static image rather than proving animation. v001 preview/evidence stay retained with these limitations; they are not runtime acceptance.
- Arch declared ground pivot960 is above its actual bottom985; pier bottom980 likewise differs. Runtime background arch uses source boundary986 to place its visible base. At240/1024, arch column-center span593 gives138.98 units. Cap socket span896 gives210 units. These sockets do not align1:1 as the platform PR claims. Independent decorative placement is accepted; a seamless structural colonnade is not.
- Platform tests verify alpha/top geometry, not lighting/color continuity at repeated joins. The runtime crop avoids transparent end bevels across the contact band; its stone texture may still show repeat joins. Existing solid-height and underside collision remains authoritative, independent of the42.89-unit visible cap height.
- Static boss/stair composites and old encounter passes do not establish their new behavior. Future integration needs actual control, contact, camera and respawn evidence.

## Preservation

Merged shared-file conflicts retain the union of all catalog records, gallery entries and contributed tests/previews. Every submitted file in all four v001 directories is locked, including prompts, notes, submission metadata, preview, JPEG generator sources, PNG exports and review evidence. Missing catalog entries for source JPEGs and the boss evidence were added. Image validation now reads actual PNG/JPEG dimensions and hashes; PNG exports retain full decoding checks. Original v001 files were not edited.

Reported generation counts/model/cost remain in each contribution's original notes. They are contributor reports, not measured billing. Unknown monetary cost remains unknown. Maintainer image-generation attempts:0.

## Validation

Combined verification passed:40 unit/visual tests;56 catalogued image dimensions/hashes;122 preserved resources; gallery/candidate browser checks; full playable encounter, solid collision, aerial attack, crouch, keyboard/gamepad/touch regression. The new runtime crop test checks a fully opaque top contact band and exact repeat width. New demo artwork must load without browser errors and show no painted floor extending over the existing gaps. Review acceptance distinguishes retained candidates, selected decoration/material and playable feature integration.
