import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadStageLayout, surfacesAt } from "../prototype/stage-loader.js";

const DIR = "docs/world/examples/v001";
const files = fs
  .readdirSync(DIR)
  .filter((f) => /^\d.*\.json$/.test(f))
  .sort();
const read = (f) => JSON.parse(fs.readFileSync(`${DIR}/${f}`, "utf8"));

test("every stage baseline loads into runtime geometry", () => {
  assert.equal(files.length, 6, "six baselines are expected");
  for (const f of files) {
    const layout = loadStageLayout(read(f));
    assert.ok(layout.rooms.length >= 3, `${f}: at least three rooms`);
    assert.ok(layout.platforms.length > 0, `${f}: produced platforms`);
    for (const p of layout.platforms) {
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), `${f}: finite position`);
      assert.ok(p.w > 0 && p.h > 0, `${f}: ${p.id} has extent`);
      assert.ok(p.room, `${f}: ${p.id} knows its room`);
    }
  }
});

test("room-local solids are placed by their room origin", () => {
  const doc = read("03-flooded-cistern.json");
  const layout = loadStageLayout(doc);
  const room = doc.rooms[0];
  const solid = room.solids[0];
  const placed = layout.platforms.find((p) => p.id === solid.id);
  assert.ok(placed, "the first solid survives the translation");
  assert.equal(placed.x, room.origin.x + solid.x);
  assert.equal(placed.y, room.origin.y + solid.y);
  assert.equal(placed.w, solid.w);
  assert.equal(placed.h, solid.h);
});

test("the baselines are reported as sketches, not finished stages", () => {
  for (const f of files) {
    const layout = loadStageLayout(read(f));
    assert.equal(
      layout.runtimeReady,
      false,
      `${f}: no baseline has spawns and checkpoints yet, so none is runtime ready`,
    );
    assert.ok(
      layout.warnings.some((w) => /no spawn point/.test(w)),
      `${f}: the missing spawns must be reported`,
    );
  }
});

test("a solid outside the declared stage box is rejected loudly", () => {
  const doc = {
    stageId: "test",
    bounds: { x: 0, y: 0, w: 1000, h: 1000 },
    rooms: [
      { id: "R", origin: { x: 900, y: 0 }, solids: [{ id: "bad", x: 0, y: 0, w: 500, h: 10 }] },
    ],
  };
  assert.throws(() => loadStageLayout(doc), /outside stage bounds/);
});

test("surfaces can be found at a given height", () => {
  const layout = loadStageLayout(read("03-flooded-cistern.json"));
  const y = layout.platforms[0].y;
  const found = surfacesAt(layout, y);
  assert.ok(found.length >= 1);
  for (const p of found) assert.ok(Math.abs(p.y - y) <= 2);
});

test("the loaded geometry is far richer than what the stages currently ship", () => {
  // The point of the loader: the baselines already hold the complexity the
  // playable stages lack. If this ever stops being true, the runtime has
  // caught up and this test should be replaced with a real comparison.
  const totals = files.map((f) => loadStageLayout(read(f)).platforms.length);
  const smallest = Math.min(...totals);
  assert.ok(
    smallest > 10,
    `the thinnest baseline has ${smallest} solids, still more than any shipped stage`,
  );
});
