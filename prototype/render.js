// Shared sprite preparation for every stage renderer.
//
// These were duplicated per stage and drifted: the Cloister's copy of keyed()
// set alpha on magenta edge pixels but never pulled the red and blue channels
// back toward green, so the hero kept a magenta halo on roughly ten thousand
// semi-transparent edge pixels that the Pilgrim Road had cleaned. Same class
// of bug as the duplicated step() in the simulations. One copy only.

export function keyed(im, magenta = false, checker = false) {
  const c = document.createElement("canvas");
  c.width = im.width;
  c.height = im.height;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(im, 0, 0);
  const pixels = g.getImageData(0, 0, c.width, c.height),
    a = pixels.data;
  if (magenta) {
    for (let i = 0; i < a.length; i += 4) {
      const excess = Math.min(a[i], a[i + 2]) - a[i + 1];
      if (excess > 80) a[i + 3] = 0;
      else if (excess > 20) {
        a[i + 3] = (255 * (80 - excess)) / 60;
        a[i] = Math.max(a[i + 1], a[i] - excess);
        a[i + 2] = Math.max(a[i + 1], a[i + 2] - excess);
      }
    }
  } else {
    // Border-connected background only; never globally erase all dark costume pixels.
    const base = [a[0], a[1], a[2]];
    const seen = new Uint8Array(c.width * c.height),
      queue = new Int32Array(seen.length);
    let head = 0,
      tail = 0;
    const add = (n) => {
      if (n < 0 || n >= seen.length || seen[n]) return;
      seen[n] = 1;
      const i = n * 4;
      const distance =
        (a[i] - base[0]) ** 2 +
        (a[i + 1] - base[1]) ** 2 +
        (a[i + 2] - base[2]) ** 2;
      const neutral =
        Math.max(a[i], a[i + 1], a[i + 2]) - Math.min(a[i], a[i + 1], a[i + 2]);
      if (checker ? neutral < 18 && a[i] > 85 : distance <= 64)
        queue[tail++] = n;
    };
    for (let x = 0; x < c.width; x++) {
      add(x);
      add((c.height - 1) * c.width + x);
    }
    for (let y = 0; y < c.height; y++) {
      add(y * c.width);
      add(y * c.width + c.width - 1);
    }
    while (head < tail) {
      const n = queue[head++];
      a[n * 4 + 3] = 0;
      if (n % c.width) add(n - 1);
      if (n % c.width < c.width - 1) add(n + 1);
      add(n - c.width);
      add(n + c.width);
    }
  }
  g.putImageData(pixels, 0, 0);
  return c;
}

export function silhouette(sheet, outline) {
  const c = document.createElement("canvas");
  c.width = sheet.width;
  c.height = sheet.height;
  const g = c.getContext("2d");
  g.beginPath();
  outline.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.closePath();
  g.clip();
  g.drawImage(sheet, 0, 0);
  return c;
}
