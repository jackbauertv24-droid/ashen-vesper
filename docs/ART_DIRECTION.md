# Art direction — v0.1

Status: proposed direction; the first concept is a candidate for review.

## Identity

Solemn Gothic adventure with deliberate action and haunted, beautiful spaces. Draw inspiration from the atmosphere and readability of classic side-scrolling action-platformers while developing a distinct setting and cast.

Working scene: an abandoned abbey gate on a rocky hillside, guarded by weathered buttresses and a distant bell tower.

## Rendering

- High-definition digital painting; no visible pixel grid.
- Side-on gameplay view with shallow depth on foreground architecture.
- Crisp silhouettes on playable surfaces and interactive objects.
- Rich material detail at close range, simplified masses at gameplay scale.
- Atmospheric depth in distant architecture without obscuring the action plane.

## Palette and light

| Role | Starting color | Use |
|---|---|---|
| Deep shadow | `#151822` | Background voids and recesses |
| Distant indigo | `#333D58` | Sky, mountains, distant towers |
| Moonlit slate | `#8292A6` | Cool highlights and atmosphere |
| Worn limestone | `#B3AEA1` | Walkable architectural surfaces |
| Lantern amber | `#D99A52` | Sparse focal accents |
| Muted moss | `#596453` | Vegetation and material variation |

These are directional swatches, not a requirement that every generated pixel use these values.

Keep playable edges legible in grayscale. Reserve the strongest local contrast for characters, threats, and useful landmarks. Avoid competing highlights across every surface.

## Environment construction

Separate sky, distant architecture, middle-distance landscape, gameplay architecture, foreground decoration, and local effects. Maintain one horizontal ground baseline in the first prototype. Painted perspective must not contradict collision surfaces.

Favor modular wall sections, buttresses, gate pillars, ledges, and small decorative props. Test repetition before treating a piece as tileable. A wide concept image is not automatically a modular level kit.

## Characters and motion

Protagonist and enemy designs remain open. Establish silhouette, proportions, costume materials, and equipment on a reference sheet before producing actions.

Lock body scale, foot pivot, facing conventions, and equipment placement. Evaluate rigged 2D versus rendered 3D before commissioning a full animation set. Individual generated poses require cleanup and consistency review.

## Avoid

- Pixel-art textures or blocky simulated upscaling.
- Photographic detail that makes action unreadable.
- Fog covering the ground plane or heavy bloom hiding silhouettes.
- Existing franchise characters, logos, distinctive costumes, or copied level layouts.
- Text embedded in environment art.

## Review criteria

1. Does the gate scene read as Gothic without depending on a familiar character?
2. Is the ground immediately identifiable at normal gameplay size?
3. Can an enemy silhouette stand apart from the background?
4. Are materials and light consistent across separately produced assets?
5. Can this direction be reproduced in multiple rooms without bespoke repainting of every frame?
