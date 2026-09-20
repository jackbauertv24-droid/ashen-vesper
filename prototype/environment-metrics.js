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
export const arcade = {
  path: "art/contributions/08-ruined-cloister/v001/exports/cloister-arch-span-v001.png",
  scale: 240 / 1024,
  groundY: 986,
  parallax: 0.35,
};
