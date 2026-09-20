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
// Every hand prop, sized against the hero rather than against each other.
//
// The hero is 144 units tall and reads as about 170cm, so one unit is
// roughly 1.2cm. Judging props one at a time produced a 34cm ember, a 41cm
// bottle and an 82cm lantern; these are set from what the object is.
//
// `opaque` is the fraction of each sheet that is not transparent padding,
// measured from the art, because every one of these sheets is mostly empty
// and the draw box is a poor guide to what you actually see.
export const HERO_HEIGHT = 144;

export const props = {
  // a glowing coal you can carry: ~21cm
  ember: { draw: 34, opaque: { w: 0.3564, h: 0.541 } },
  // a hand bottle: ~26cm
  vial: { draw: 40, opaque: { w: 0.2637, h: 0.543 } },
  // a hanging lantern: ~50cm
  lantern: { draw: 45, opaque: { w: 0.4648, h: 0.9375 } },
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
