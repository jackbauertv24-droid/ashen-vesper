import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { PNG } from "pngjs";
const jobs = {
  "01-bellwarden-crouch": {
    cell: 512,
    cols: 3,
    rows: 2,
    pivot: [192, 464],
    reference: 384,
    display: 144,
    names: [
      "crouch-idle",
      "crawl-a",
      "crawl-b",
      "low-windup",
      "low-contact",
      "low-recovery",
    ],
  },
  "02-bellwarden-air-attack": {
    cell: 512,
    cols: 3,
    rows: 2,
    pivot: [192, 464],
    reference: 384,
    display: 144,
    names: [
      "air-windup-a",
      "air-windup-b",
      "air-contact-a",
      "air-contact-b",
      "air-recovery-a",
      "air-recovery-b",
    ],
  },
  "03-hollow-pilgrim-melee": {
    cell: 768,
    cols: 4,
    rows: 3,
    pivot: [256, 704],
    reference: 480,
    display: 150,
    names: [
      "idle",
      "walk-a",
      "walk-pass",
      "walk-b",
      "windup-a",
      "windup-b",
      "strike-a",
      "strike-b",
      "recover-a",
      "recover-b",
      "hurt",
      "death",
    ],
  },
};
const filename = process.argv[2];
assert.ok(
  filename,
  "Usage: node tools/validate-art-submission.mjs submission.json",
);
const doc = JSON.parse(fs.readFileSync(filename)),
  job = jobs[doc.jobId];
assert.ok(job, "Unknown art job");
assert.ok(
  ["candidate", "ready-for-review"].includes(doc.status),
  "Invalid status",
);
assert.equal(
  doc.assets.length,
  1,
  "Submit the specified full sheet; preserve additional sources and variants separately",
);
for (const a of doc.assets) {
  const root = path.resolve("art/contributions", doc.jobId);
  const full = path.resolve(a.path);
  assert.ok(
    full.startsWith(root + path.sep),
    "Export must remain in this job directory",
  );
  const bytes = fs.readFileSync(full),
    png = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6, "Export must be an RGBA PNG");
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    a.sha256,
    "Hash mismatch",
  );
  assert.equal(png.width, job.cell * job.cols);
  assert.equal(png.height, job.cell * job.rows);
  assert.equal(a.width, png.width);
  assert.equal(a.height, png.height);
  assert.equal(a.cellWidth, job.cell);
  assert.equal(a.cellHeight, job.cell);
  assert.equal(a.referenceHeight, job.reference);
  assert.equal(a.displayHeight, job.display);
  assert.deepEqual(
    a.frames.map((f) => f.name),
    job.names,
    "Missing/out-of-order frames",
  );
  for (const [i, f] of a.frames.entries()) {
    assert.equal(f.x, (i % job.cols) * job.cell);
    assert.equal(f.y, Math.floor(i / job.cols) * job.cell);
    assert.equal(f.width, job.cell);
    assert.equal(f.height, job.cell);
    assert.deepEqual([f.pivotX, f.pivotY], job.pivot);
    let opaque = 0,
      clear = 0;
    for (let y = 0; y < job.cell; y++)
      for (let x = 0; x < job.cell; x++) {
        const alpha = png.data[((y + f.y) * png.width + x + f.x) * 4 + 3];
        if (alpha > 0) opaque++;
        else clear++;
        if (x < 4 || y < 4 || x >= job.cell - 4 || y >= job.cell - 4)
          assert.equal(
            alpha,
            0,
            `${f.name}: painted cell border/clipped silhouette`,
          );
      }
    assert.ok(
      opaque > job.cell ** 2 * 0.005,
      `${f.name}: empty/nearly empty frame`,
    );
    assert.ok(
      clear > job.cell ** 2 * 0.1,
      `${f.name}: insufficient real transparency`,
    );
  }
}
console.log(
  `${doc.jobId}: export geometry, hashes, RGBA, occupancy and cell padding pass. Anatomy, silhouette completeness, timing and runtime use still require visual review.`,
);
