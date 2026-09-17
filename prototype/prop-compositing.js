// Original ember has a neutral blue matte. Separate the warm painted silhouette
// from that matte; never screen-blend the opaque source over the whole scene.
export function emberCutout(image) {
  const c = document.createElement("canvas");
  c.width = image.width;
  c.height = image.height;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(image, 0, 0);
  const pixels = g.getImageData(0, 0, c.width, c.height),
    a = pixels.data;
  for (let i = 0; i < a.length; i += 4) {
    const warmth = a[i] - a[i + 2];
    // Matte is blue; flame, brass and bell details are warm. A narrow alpha
    // ramp avoids retaining the wide studio glow as a rectangular veil.
    a[i + 3] = Math.round(255 * Math.max(0, Math.min(1, (warmth - 15) / 45)));
  }
  g.putImageData(pixels, 0, 0);
  return c;
}
