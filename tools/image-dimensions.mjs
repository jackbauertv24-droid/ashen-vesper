import assert from "node:assert/strict";
export function imageDimensions(bytes) {
  if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    assert(bytes.length >= 29, "Truncated PNG header");
    return {
      width: bytes.readUInt32BE(16),
      height: bytes.readUInt32BE(20),
      format: "png",
      alpha: [4, 6].includes(bytes[25]),
    };
  }
  assert(bytes[0] === 255 && bytes[1] === 216, "Unsupported image header");
  let offset = 2;
  while (offset < bytes.length) {
    assert.equal(bytes[offset++], 255, "Invalid JPEG marker");
    while (bytes[offset] === 255) offset++;
    const marker = bytes[offset++];
    if (marker === 217 || marker === 218) break;
    if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
    assert(offset + 2 <= bytes.length, "Truncated JPEG marker");
    const length = bytes.readUInt16BE(offset);
    assert(
      length >= 2 && offset + length <= bytes.length,
      "Invalid JPEG segment length",
    );
    if (
      [
        192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207,
      ].includes(marker)
    ) {
      assert(length >= 8, "Truncated JPEG frame");
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5),
        format: "jpeg",
        alpha: false,
      };
    }
    offset += length;
  }
  throw Error("JPEG has no supported frame dimensions");
}
