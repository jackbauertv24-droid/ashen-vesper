// Runtime crops of the preserved motion sheet. Coordinates are in source pixels.
// The supplied atlas clips feet and weapons; these silhouettes isolate whole poses.
export const pilgrimFrames = {
  idle: {
    pivot: [220, 687],
    facing: -1,
    outline: [
      [15, 120],
      [365, 120],
      [365, 700],
      [15, 700],
    ],
  },
  shuffle: {
    pivot: [540, 687],
    facing: 1,
    outline: [
      [365, 210],
      [470, 180],
      [663, 180],
      [663, 260],
      [741, 260],
      [741, 370],
      [676, 420],
      [665, 700],
      [365, 700],
    ],
  },
  windup: {
    pivot: [850, 687],
    facing: 1,
    outline: [
      [665, 178],
      [975, 55],
      [1048, 55],
      [1048, 142],
      [953, 180],
      [975, 700],
      [720, 700],
      [755, 280],
      [785, 222],
      [765, 177],
      [675, 210],
    ],
  },
  strike: {
    pivot: [1080, 687],
    facing: 1,
    outline: [
      [980, 220],
      [1370, 220],
      [1370, 705],
      [980, 705],
    ],
  },
};
export const pilgrimScale = 0.28;
export function pilgrimPose(e) {
  if (e.mode === "windup") return "windup";
  if (e.mode === "strike") return e.timer > 0.16 ? "windup" : "strike";
  if (e.mode === "recover") return e.timer > 0.45 ? "strike" : "shuffle";
  if (e.mode === "approach" || e.mode === "patrol") return "shuffle";
  return "idle";
}
