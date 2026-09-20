# Ruined Cloister runtime regression review

The first standalone Stage02 build duplicated a reduced game loop and therefore lost behavior already proven in Pilgrim Road. This review treats Pilgrim Road as the minimum runtime contract for every later stage.

| Area | Regression found | Corrected contract |
| --- | --- | --- |
| Hero presentation | Static rectangle, then static idle art | Retained idle/walk cycle, airborne ascent/apex/fall poses, three-phase ground/air attack and calibrated six-pose crouch sheet |
| Hero input | Keyboard/touch subset | Keyboard, touch and gamepad movement, jump, crouch, attack and interaction |
| Enemy | Rectangle with health bar and no meaningful attack | Retained whole-body Hollow Pilgrim poses, approach, windup warning, contact, recovery, damage, invulnerability and defeat |
| Architecture | Full transparent canvases repeated at the wrong interval; separate piers overlapped the spans | Crop to measured opaque arch bounds and repeat at its rendered width; do not layer incompatible pier copies |
| Floors | Full repetition exposed tapered ends; stretching the middle removed joins but visibly distorted its cool-left/warm-right painted lighting | Keep v001 preserved and withdrawn. PR33 v002 center strip passed three-copy color/grayscale review and now repeats at its authored 240-unit scale; decorative ends await socket-aligned final widths |
| Player state | No damage or respawn loop | Five health, damage feedback, invulnerability, death/respawn, and preserved vial/lever state |
| Verification | Browser captured before the runtime explicitly reported ready | Wait for `window.cloister.ready`, move the character, assert animation time advances, then capture |

## Still intentionally incomplete

- The current enemy reuses the Hollow Pilgrim motion set. The Iron Sexton reference still needs an authored motion sheet before it can replace that placeholder.
- Pilgrim Road and the Cloister remain separate entry points until cross-stage persistence, safe spawns and return travel are implemented.
- The stage is a four-beat integration route rather than the final six-room layout adaptation.
- Sound and a checkpoint object remain to be brought across before Stage02 can claim full Pilgrim Road parity.

Future stages must start from the shared runtime contract or extract shared components first. A new stage may not replace an existing animated actor or interaction with rectangles merely to display environment art.
