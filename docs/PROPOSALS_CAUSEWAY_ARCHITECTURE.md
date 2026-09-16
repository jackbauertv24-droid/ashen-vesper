# Abbey Causeway & Architectural Platform Proposals

Status: Candidate architectural asset family submitted for owner review (PR).

## 1. Overview & Scope

In accordance with review guidance in [docs/ASSET_PR_REVIEW.md](ASSET_PR_REVIEW.md), this proposal contributes **one tightly bounded asset family**: **The Abbey Causeway Architectural Kit** (`art/production/abbey/`).

This kit directly provides the modular pieces identified during prototype analysis and owner review:
1. **Left-Side End-Cap Terminal (`masonry-endcap-left-v001`)**: Complements the existing right-side endcap (`masonry-endcap-v001`), providing natural stone termination for both ends of walkable causeways.
2. **Causeway Stone Bridge Arch (`masonry-causeway-arch-v001`)**: Gothic vaulted undercroft and fractured bridge voussoirs spanning the 80-unit gap jump beneath the walkway.
3. **Abbey Gate Portal & Portcullis (`abbey-gate-portal-v001`)**: Entrance portal and rusted iron portcullis with a deep interior shadow void (`#151822`) for room transition triggers (fulfilling M1 and M3).
4. **Abbey Balustrade Parapet Railing (`abbey-balustrade-railing-v001`)**: Pierced quatrefoil Gothic stone railing to cap elevated platforms and ledges without obstructing player visibility.

---

## 2. Asset Specifications & Generation Directives

### Asset 1: Abbey Masonry Left End-Cap Module (`masonry-endcap-left-v001`)
- **File**: [`art/production/abbey/masonry-endcap-left-v001.png`](../art/production/abbey/masonry-endcap-left-v001.png)
- **Metadata**: [`art/production/abbey/masonry-endcap-left-v001.json`](../art/production/abbey/masonry-endcap-left-v001.json)
- **Resolution**: 1200 × 896 px | **Format**: PNG | **Status**: `prototype`
- **SHA-256**: `9c232abf0316e9f06daddb3c5e82137b11077a4035f1fcc57b4998eac1d59ee0`
- **In-Game Role**: Left-hand platform terminal pairing with `masonry-endcap-v001` to cap causeway cuts.
- **Generation Prompt**:
  > *"Digital painting of an architectural platform end-cap and corner piece for a 2D side-scrolling action platformer game. Side-on orthographic 2D profile view. A weathered Gothic abbey causeway edge and stone terminal for the LEFT edge of a platform. The top surface is a perfectly flat, horizontal walking ledge of worn limestone (#B3AEA1). The LEFT edge terminates naturally with chiseled, weathered stone blocks, a fractured masonry corner, corbel overhang, and subtle muted moss (#596453) in the joints. The vertical face shows heavy ashlar stone masonry with deep shadow crevices (#151822) and cool moonlit slate highlights (#8292A6). Exactly matches the stone height, style, perspective, and lighting of masonry-endcap-v001.png, but oriented to cap the left-hand end of a causeway. Clean neutral dark background, no 3D tilt, painted realism, no pixel art, no visible pixel grid."*
- **Measured Geometry**:
  - Visible stone baseline: y ≈ 215 px
  - Cap height: 110 px
  - Corbel overhang: 90 px

---

### Asset 2: Abbey Causeway Bridge Arch Module (`masonry-causeway-arch-v001`)
- **File**: [`art/production/abbey/masonry-causeway-arch-v001.png`](../art/production/abbey/masonry-causeway-arch-v001.png)
- **Metadata**: [`art/production/abbey/masonry-causeway-arch-v001.json`](../art/production/abbey/masonry-causeway-arch-v001.json)
- **Resolution**: 1200 × 896 px | **Format**: PNG | **Status**: `prototype`
- **SHA-256**: `fd010c74e46747873ced9fbfc3ee5ac8b3f570f71e0c9cea172d2d835d123d47`
- **In-Game Role**: Under-arch structure supporting the broken causeway span and visualising the causeway gap.
- **Generation Prompt**:
  > *"Digital painting of a modular Gothic abbey stone bridge arch and causeway undercroft for a 2D side-scrolling action platformer game. Side-on orthographic 2D profile view. A weathered Gothic stone arch structure designed to span beneath a broken causeway. Heavy ashlar voussoir arch stones of worn limestone (#B3AEA1), deep recessed shadow vault beneath the arch (#151822), cool moonlit slate highlights (#8292A6), with subtle damp moss (#596453) clinging to the stone joints. Flat horizontal top edge matching the platform level. Matches the stone scale, material texture, and lighting of masonry-module-v001.png. Clean neutral dark background, no 3D tilt, painted realism, no pixel art, no visible pixel grid."*

---

### Asset 3: Abbey Entrance Portal & Portcullis Gate (`abbey-gate-portal-v001`)
- **File**: [`art/production/abbey/abbey-gate-portal-v001.png`](../art/production/abbey/abbey-gate-portal-v001.png)
- **Metadata**: [`art/production/abbey/abbey-gate-portal-v001.json`](../art/production/abbey/abbey-gate-portal-v001.json)
- **Resolution**: 896 × 1200 px | **Format**: PNG | **Status**: `prototype`
- **SHA-256**: `c0380135eb4947dba251e4bfd955304c9eb5ea4c08c9a064c5ef71c2be420f4b`
- **In-Game Role**: Gateway transition module defining room exit/entry boundaries.
- **Generation Prompt**:
  > *"Digital painting of a modular Gothic abbey entrance portal and portcullis gate for a 2D side-scrolling action platformer game. Side-on orthographic 2D profile view. A grand Gothic stone doorway and archway framing a room transition. Heavy weathered limestone masonry (#B3AEA1) with deep shadow crevices (#151822) and cool moonlit slate highlights (#8292A6). A heavy rusted wrought-iron portcullis gate hangs inside the arched opening with iron spikes and chain pulleys. Base rests on a flat horizontal floor line. Deep darkness (#151822) inside the open portal doorway. Matches the architectural style and stone texture of buttress-pillar-v001.png. Clean neutral dark background, no 3D tilt, painted realism, no pixel art, no visible pixel grid."*

---

### Asset 4: Abbey Gothic Parapet Balustrade Railing (`abbey-balustrade-railing-v001`)
- **File**: [`art/production/abbey/abbey-balustrade-railing-v001.png`](../art/production/abbey/abbey-balustrade-railing-v001.png)
- **Metadata**: [`art/production/abbey/abbey-balustrade-railing-v001.json`](../art/production/abbey/abbey-balustrade-railing-v001.json)
- **Resolution**: 1376 × 768 px | **Format**: PNG | **Status**: `prototype`
- **SHA-256**: `b1c0ddae37ec3f1044e5ba8d9de8528e26eeb28749c5339cbf0ef9ab7b67ddab`
- **In-Game Role**: Modular stone railing capping elevated walkway ledges.
- **Generation Prompt**:
  > *"Digital painting of a modular Gothic stone balustrade parapet and pierced railing for a 2D side-scrolling action platformer game. Side-on orthographic 2D elevation view. A horizontal section of weathered Gothic limestone balustrade (#B3AEA1) designed to sit on top of raised stone platforms and ledges. Featuring carved Gothic pierced quatrefoil and lancet tracery cutouts with dark shadow openings (#151822). Worn limestone cap rail with moonlit slate highlights (#8292A6) and subtle moss (#596453) at the base joints. Completely flat horizontal base for modular placement on ledges. Matches the material and scale of masonry-module-v001.png. Clean neutral dark background, no 3D tilt, painted realism, no pixel art, no visible pixel grid."*

---

## 3. Review Compliance & Integration Readiness

In accordance with [docs/ASSET_PR_REVIEW.md](ASSET_PR_REVIEW.md):
- **Candidate Classification**: All assets are cataloged with `"runtimeStatus": "not-integrated"` and `"metadataStatus": "draft-unverified"`. They are candidate source materials for the library.
- **No Premature Integration**: The running prototype (`prototype/game.js`) is kept intact and clean.
- **Exact Hash Preservation**: All new sources and metadata are added to `art/library/submissions.lock.json`.
