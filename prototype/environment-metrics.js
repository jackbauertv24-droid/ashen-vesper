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
// The hanging censer. Its strike box in encounter-sim is 48x62 units, so the
// painted bell is sized to sit inside that rather than dwarf it. Drawing the
// whole asset shows its own mount and chains; bellTop/bellBottom/bellWidth are
// where the bell sits within that box, measured from the art.
export const censer = {
  path: "art/contributions/04-brazier-alpha/v001/source/brazier-alpha-generated-v001.png",
  draw: 120,
  top: -102,
  bellTop: 561 / 1254,
  bellBottom: 1205 / 1254,
  bellWidth: 600 / 1254,
};

// The consecration ember, as a falling pickup and as the lit sanctuary.
// The art is mostly transparent padding: only 365x554 of 1024x1024 is opaque.
export const ember = { draw: 64, opaque: { w: 365 / 1024, h: 554 / 1024 } };

export const arcade = {
  path: "art/contributions/08-ruined-cloister/v001/exports/cloister-arch-span-v001.png",
  scale: 240 / 1024,
  groundY: 986,
  parallax: 0.35,
};
