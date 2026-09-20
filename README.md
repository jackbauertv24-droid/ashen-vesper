# Ashen Vesper

An original Gothic action-platformer inspired by classic side-scrolling adventures: haunted architecture, deliberate movement, readable combat and a world painted in moonlight.

**Working title · playable encounter prototype v0.3**

**Contributors:** start with the [current milestones](docs/NEXT_MILESTONES.md), then see [wanted assets](docs/WANTED_ASSETS.md), the [prioritized future-content queue](docs/FUTURE_CONTENT.md) and [copyable art briefs](docs/art-jobs/README.md). Next: Ruined Cloister, Bell Moth, healing vial and lever/grate. Later: Flooded Cistern, Bell Tower, new enemies, relics and the Tollkeeper boss. These are planned additions, not current demo features.

**Map design:** [why the stages feel alike and what is planned](docs/MAP_DESIGN.md).

**Whole-world contributions:** [six-stage map workflow and prompts](docs/world/README.md), including room-layout contracts, reusable kits, stage dependencies and bounded PR jobs.

**Stage layout baselines:** [six map examples and contributor instructions](docs/world/examples/README.md) · [neutral scrolling diagrams](docs/world/examples/v001/preview.html). Geometry is supplied separately from written HD art direction; new stages remain planning-only.

There are four pages, and every one carries the same menu:

| Page | What it is |
| --- | --- |
| [Pilgrim Road](https://jackbauertv24-droid.github.io/ashen-vesper/) | Stage 01, playable |
| [Ruined Cloister](https://jackbauertv24-droid.github.io/ashen-vesper/cloister.html) | Stage 02, playable |
| [Flooded Cistern](https://jackbauertv24-droid.github.io/ashen-vesper/cistern.html) | Stage 03, playable |
| [Art study](https://jackbauertv24-droid.github.io/ashen-vesper/study.html) | The original motion and masonry study; not a stage |
| [Art library](https://jackbauertv24-droid.github.io/ashen-vesper/art/library/gallery.html) | Every retained asset at original resolution |

Each art submission also ships its own preview page under
`art/contributions/`, but those are review evidence rather than part of the
demo.


The two stages are now one run. Light the sanctuary, cross the threshold
beyond it, and the Cloister keeps your health and everything you changed on
the road — and still does when you walk back. The crossing is still a page
load; merging the renderers is the remaining half of that milestone.

## The Pilgrim Road

Cross a five-screen causeway, break a hanging brazier, collect its falling ember, defeat the guards and offer the ember at the sealed gate. Reach the sanctuary to complete the encounter and set a checkpoint.

- Three main-route gaps and two optional elevated routes.
- Three guards with anticipation, attack, recovery and damage states.
- Five player health points, brief invulnerability, death and respawn.
- Smooth/tighter camera presets, gradual look-ahead and layered scrolling.
- Optional air control, impact pause and synthesized sound cues.
- Keyboard, touch and standard-mapped gamepad controls.

**Keyboard:** A/D or arrows move · Space jumps · J strikes on the ground or in the air · K or Shift quick-steps away from danger · S/down crouches and crawls · E interacts · R restarts. Gamepad: stick/D-pad move, A jump, X strike, Y dodge, B interact, down crouch. Sound starts muted.

Masonry blocks have solid sides and undersides. New contributor-painted floor caps align with those collision tops, and pierced arcade arches appear in the distant scenery. Jump up the steps, or crouch through passages with enough headroom. Enemy staff damage follows the physical weapon sweep. The crouch pose and aerial strike art remain provisional; [contributor art jobs](docs/art-jobs/README.md) provide generation prompts, exact export specifications and acceptance tests for replacement animations.

Crouching uses dedicated bent-knee poses. Enemy melee uses the retained whole-body windup and contact artwork, including its painted staff. Character masks and sparse animation timing still need refinement. The contributor grate visibly closes the gate; opening reveals the retained raised-gate layer. Travel animation is still pending. Progress persists through death within a run, not across reloads. See [encounter notes](docs/ENCOUNTER.md).

## Run and check

Requires Node.js 20 or later:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173. The art study is at `/study.html`.

```sh
npm test                  # ~1s   gameplay and the shared runtime contract
npm run test:stage        # ~12s  every stage boots, plays and composes a correct frame
npm run test:art          # ~2s   submitted image structure
npm run validate:assets   # ~4s   originals preserved byte-for-byte
npm run test:route        # ~22s  the full Pilgrim Road completed with real input
```

Browser tiers need `npx playwright install chromium --with-deps` once.
See [the build standard](docs/BUILD_STANDARD.md) for when each tier runs.

## Art preservation

All original submissions stay at their original paths and resolution, including unused designs and draft metadata. Runtime selection does not control retention. Versioned sources are checked against the [preservation lock](art/library/submissions.lock.json). Generation attempts and unknown usage costs are recorded with each contribution.

- [Art direction](docs/ART_DIRECTION.md)
- [Retained library](art/library/README.md) and [asset catalog](art/manifest.json)
- [Submission reviews](docs/ASSET_PR_REVIEW.md)
- [Asset specification](docs/ASSET_SPEC.md)
- [Production roadmap](docs/ROADMAP.md)
- [Future-content queue and prompts](docs/FUTURE_CONTENT.md)
- [Original pilot notes](docs/PILOT.md)
- [Contributing](CONTRIBUTING.md)

## Project status

An independent project, not an official release or affiliated continuation of an existing franchise. No blanket reuse license has been selected. See [RIGHTS.md](RIGHTS.md).
