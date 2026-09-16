# Ashen Vesper

An original Gothic action-platformer art project inspired by classic side-scrolling adventures: haunted architecture, deliberate movement, readable combat, and a world painted in moonlight.

**Working title · playable browser art study**

[Play the courtyard study](https://jackbauertv24-droid.github.io/ashen-vesper/) · [Pilot notes](docs/PILOT.md)

![The Abbey Gate — first environment concept](art/concepts/abbey-gate-concept-v001.png)

*The Abbey Gate, concept v001. A flattened visual study; used as the backdrop for the first motion study.*

## Visual direction

High-definition, non-pixel, hand-painted environments with a side-on gameplay camera. Weathered limestone, aged iron, thorny vegetation, cool moonlight, and small pools of amber light establish the first scene: a ruined abbey entrance.

The emphasis is on clear silhouettes and traversable surfaces. Detail supports the action; scenery stays quieter than characters and hazards.

## First milestone: the abbey gate

Create one cohesive scene, then turn it into a small playable slice with a protagonist, one enemy, an attack, a pickup, and a room transition.

1. Review the entrance environment concept.
2. Establish protagonist and enemy designs against that environment.
3. Produce separate background layers and modular environment pieces.
4. Prototype movement, animation alignment, and collision in a small scene.
5. Validate readability and consistency before extending the world.

Concept illustrations establish direction. Production assets need separate exports and validation before they are ready for an engine.

## Project guide

- [Art direction](docs/ART_DIRECTION.md)
- [Production roadmap](docs/ROADMAP.md)
- [Asset catalog](art/manifest.json)
- [Asset specification](docs/ASSET_SPEC.md)
- [Contributing](CONTRIBUTING.md)

## Repository layout

```text
art/concepts/     Visual development and reference images
art/production/   Validated assets intended for engine integration
art/manifest.json Asset status, dimensions, and intended use
docs/            Art direction, specifications, and production decisions
```

## Project status

This is an independent project, not an official release or an affiliated continuation of any existing franchise. Character designs, architecture, names, and visual motifs are developed for this project.

No blanket reuse license has been selected yet. See [RIGHTS.md](RIGHTS.md).

## Run locally

Requires Node.js 20 or later. Run `npm ci`, then `npm run dev`, and open http://127.0.0.1:4173.

Move with A/D or arrow keys, jump with Space, attack with J, reset with R. Touch controls are available on small screens. Click **Show guides** to inspect collision surfaces.

Checks: `npm test`, `npm run validate:assets`; install Chromium with `npx playwright install chromium --with-deps`, then run `npm run test:browser`.

This pilot demonstrates walking, jumping, one sword attack, and repeated masonry. It has a practice target, a flattened backdrop, and temporary jump art. It is not yet the full entrance encounter.
