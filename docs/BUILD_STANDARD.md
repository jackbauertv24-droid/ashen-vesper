# Build standard

This replaces "a retained image is not an integrated feature" as the project's
single rule with its missing half: **a test is only worth its cost if it
prevents a defect someone would actually see.**

The suite this standard replaced had 316 assertions about PNG alpha channels
and took 31 headless-browser screenshots that were compared to nothing, while
the flagship demo shipped a floor that visibly tiled warm/cool stripes. It was
a submission-intake pipeline mistaken for a quality gate. Green meant "every
PNG is well-formed," and everyone read it as "the game is fine."

## The four tiers

| Command | Cost | Runs | Answers |
| --- | --- | --- | --- |
| `npm test` | ~1s | every change | Does the game still behave? |
| `npm run test:stage` | ~12s | every change that touches a stage, renderer or runtime art | Does the composed frame look right? |
| `npm run test:art` | ~2s | when art files change | Is the submission well-formed? |
| `npm run validate:assets` | ~4s | when art files change | Are the originals preserved byte-for-byte? |
| `npm run test:route` | ~22s | before a release, or when movement/combat changes | Can a human still finish the Pilgrim Road? |

CI (`.github/workflows/ci.yml`) runs all of this on every push and pull
request, split into a fast no-browser job and one browser job. A failing
composed-frame check uploads the frame it rejected as a build artifact, so the
evidence exists exactly when someone needs it and never otherwise.

`npm test` is the loop you work in. It must stay about a second; if it grows,
move the slow thing down a tier rather than accepting a slower loop.

## The runtime contract

Every stage moves the player through `prototype/physics.js`. A stage owns its
level data, props, enemies, mechanisms and camera — nothing else.

This is not a style preference. Stage 02 was built by hand-copying a reduced
`step()`, and it silently diverged: crouch speed 90 instead of 85, no air
control at all despite the option being advertised, no impact pause, no
low-ceiling guard, and no collision epsilons. Every one of those is a
difference a player can feel, and none of them failed a test, because the two
stages were measured against different bars.

The same rule applies to drawing. Sprite preparation lives once in
`prototype/render.js`; a stage renderer may own its scenery, not its own copy
of the shared helpers. The duplicated versions had already drifted — the
Cloister keyed magenta edges without pulling red and blue back toward green,
so the hero outline rendered slightly differently in the two stages.

`test/runtime-contract.test.mjs` now runs the same assertions against every
registered stage. **Register a new stage in its `stages` array in the same PR
that adds it.** A stage that re-implements movement fails there instead of
shipping a quietly different game.

## What a test must do

Before adding a test, name the defect it catches and where a person would see
it. If the answer is "the file would be malformed," it belongs in `test:art`,
not in the loop.

- **Test the composed result, not the ingredient.** A PNG with a correct alpha
  border can still tile as stripes. `tools/stage-check.mjs` boots each stage,
  plays it with real input, and asserts on the rendered frame.
- **Never capture evidence you do not compare.** A screenshot written to a
  gitignored directory and read by nobody is cost without cover.
  `stage-check` writes a frame only when an assertion fails, and names the
  failing row and colours in the message.
- **Assert the contract, not the current value.** `MOVE.run`, not `235`.
- **A new mechanic needs a test at the tier that would catch it breaking.**

## No game object is a coloured box

Code-drawn colour may be UI chrome, a debug overlay or a full-screen
atmospheric wash. It may never stand in for a prop, an actor, a platform
body, a hazard surface or any other object the player reads as part of the
world. This covers gradients and shading, not only flat rectangles: Stage
03 shipped its water as a gradient with a sine-wave stroke for ripples, and
that read as cheap shading against painted art.

This is enforced, not just advised: `test/runtime-contract.test.mjs` scans
the renderers and fails on any `fillRect` colour outside a short allowlist,
each entry carrying its reason. Placeholders of this kind are invisible to
structural tests — a rectangle always renders correctly — and they are the
cheapest possible tell that something is unfinished. Four shipped this way
before the rule existed: a struck censer's remnant, a defeated guard's
remains, the Cloister's platform bodies, and the Road's foreground posts.

When the right asset does not exist, reuse one that fits, leave the object
out, and record the gap in [wanted assets](WANTED_ASSETS.md). Shipping a
coloured rectangle is not one of the options.

## Art

The preservation rules are unchanged and still right: every original,
reject, prompt and variant stays at its original path and resolution, locked
by `art/library/submissions.lock.json`, with derivatives versioned as v002+.
Generation stays budget-sensitive; prefer the retained library.

What changes is that **structural validation no longer counts as acceptance.**
An asset the runtime repeats must also pass the tiling contract — no seam
jump, no left-to-right lighting drift — and must be seen in a composed frame
before a PR calls it integrated.

## Status vocabulary

Unchanged, and still required on every PR: planning-only, retained candidate,
selected prototype, usable export, or runtime integration. A preview cannot
claim collision, movement, damage or persistence without code and
actual-input tests.
