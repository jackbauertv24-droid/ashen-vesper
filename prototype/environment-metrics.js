// Shared environment metrics. Every stage repeats the same seamless floor cap
// at the same authored interval; PR33 proved this strip tiles without the
// cool-to-warm jump the v001 crop produced. Collision height stays independent
// of the art and comes from physics.js.
export const platformCap = {
  path: "art/contributions/world-02-ruined-cloister/v002/exports/platform-cap-center-v002.png",
  repeat: 240,
  height: 60,
  lift: 7.5,
};
// The hanging censer, at the size it has always been on screen.
//
// The original drew the whole 1254x1254 asset into an 84x100 box, giving a
// bell 40x51 units spanning -41..+10. Two changes broke that: showing the
// asset's own chains scaled everything to 96x103, and then "fixing" it to
// match the 48x62 strike box left it at 57x62 — still a fifth taller and
// half again as wide as it had ever been.
//
// The rule is that painted art must not EXCEED the box the player can hit,
// not that it must fill it. A prop slightly smaller than its box is a little
// easier to strike than it looks, which is fine. So the bell is back to its
// original 51-unit height and position; the only difference from the very
// first version is that the square asset is no longer squashed 16%
// horizontally, which is why it is 48 wide rather than 40.
export const censer = {
  path: "art/contributions/04-brazier-alpha/v001/source/brazier-alpha-generated-v001.png",
  draw: 100,
  top: -86,
  bellTop: 561 / 1254,
  bellBottom: 1205 / 1254,
  bellWidth: 600 / 1254,
};

// The consecration ember, as a falling pickup and as the lit sanctuary.
// The art is mostly transparent padding: only 365x554 of 1024x1024 is opaque.
// Prop sizes, judged by what the player needs to see rather than by what
// the object would measure in life.
//
// Sizing these to physical plausibility was a mistake: it produced a 22cm
// ember, which is a believable coal and an unreadable game item. A pickup
// is not a prop — it is a thing the player has to spot across a scrolling
// room, and the consecration ember is the object the entire Pilgrim Road
// encounter is about. It gets to be obvious.
//
// Scenery is different: nobody has to find a lantern, so it can simply look
// right. The two categories are judged by different rules on purpose.
//
// `opaque` is the fraction of each sheet that is not transparent padding,
// measured from the art, because these sheets are mostly empty and the draw
// box is a poor guide to what is actually seen.
export const HERO_HEIGHT = 144;

export const props = {
  // PICKUP — the quest item. Roughly a third of the hero, unmistakable.
  ember: { draw: 85, opaque: { w: 0.3564, h: 0.541 }, kind: "pickup" },
  // PICKUP — a consumable, clearly readable but below the quest item.
  vial: { draw: 66, opaque: { w: 0.2637, h: 0.543 }, kind: "pickup" },
  // SCENERY — nobody hunts for it, so plausible size is the right rule.
  lantern: { draw: 45, opaque: { w: 0.4648, h: 0.9375 }, kind: "scenery" },
};

/** Visible size on screen, ignoring the sheet's transparent padding. */
export const visible = (prop) => ({
  w: prop.draw * prop.opaque.w,
  h: prop.draw * prop.opaque.h,
});

export const ember = props.ember;

export const arcade = {
  path: "art/contributions/08-ruined-cloister/v001/exports/cloister-arch-span-v001.png",
  scale: 240 / 1024,
  groundY: 986,
  parallax: 0.35,
};
