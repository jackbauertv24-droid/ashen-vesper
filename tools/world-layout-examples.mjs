import fs from "node:fs";
import assert from "node:assert/strict";
const versionIndex = process.argv.indexOf("--version");
const version = versionIndex < 0 ? "v001" : process.argv[versionIndex + 1];
assert(/^v\d{3}$/.test(version), "Version must look like v001");
const root = `docs/world/examples/${version}`;
const index = JSON.parse(fs.readFileSync(`${root}/index.json`));
const docs = index.stages.map((s) =>
  JSON.parse(fs.readFileSync(`${root}/${s.stageId}.json`)),
);
const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
const rect = (r, extra = "") =>
  `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" ${extra}/>`;
function drawing(d) {
  let svg = "";
  for (const r of d.rooms) {
    svg += `<g transform="translate(${r.origin.x} ${r.origin.y})">`;
    svg += rect(r.bounds, 'fill="#f4f6f8" stroke="#6f7f8c" stroke-width="4"');
    for (const x of r.solids) svg += rect(x, 'fill="#8695a3"');
    for (const x of r.stairRegions) svg += rect(x, 'fill="#f0bd53"');
    for (const x of r.unknownAreas) svg += rect(x, 'fill="#ea92b3"');
    for (const x of r.topEdges)
      svg += `<path d="M${x.x},${x.y}h${x.w}" stroke="#283641" stroke-width="6"/>`;
    for (const x of r.stairGuides)
      svg += `<circle cx="${x.anchor.x}" cy="${x.anchor.y}" r="12" fill="#94620d"/><text x="${x.anchor.x + 16}" y="${x.anchor.y - 12}" font-size="22">${escape(x.direction)}</text>`;
    svg += `<text x="${r.bounds.x + 16}" y="32" font-size="28" fill="#17242e">${escape(r.id)}</text></g>`;
  }
  for (const x of d.sharedSpaces)
    svg += rect(
      x.bounds,
      'fill="none" stroke="#9057b3" stroke-width="12" stroke-dasharray="28 16"',
    );
  for (const c of d.connections) {
    const a = d.rooms.find((r) => r.id === c.from),
      b = d.rooms.find((r) => r.id === c.to),
      x = a.origin.x + c.exit.x,
      y = a.origin.y + c.exit.y;
    svg += `<circle cx="${x}" cy="${y}" r="18" fill="white" stroke="#077888" stroke-width="6"/><text x="${x + 24}" y="${y - 20}" font-size="24" fill="#075966">${escape(c.id)}</text>`;
    assert.equal(x, b.origin.x + c.entrance.x);
    assert.equal(y, b.origin.y + c.entrance.y);
  }
  return svg;
}
function validate() {
  let rooms = 0,
    joins = 0,
    rects = 0,
    stairs = 0;
  for (const d of docs) {
    assert.equal(d.status, "layout-example-not-runtime-ready");
    const ids = new Set();
    for (const r of d.rooms) {
      assert(!ids.has(r.id));
      ids.add(r.id);
      rooms++;
      assert(r.origin.x + r.bounds.x >= 0);
      assert(r.origin.y >= 0);
      assert(r.origin.x + r.bounds.x + r.bounds.w <= d.bounds.w);
      assert(r.origin.y + r.bounds.h <= d.bounds.h);
      for (const group of ["solids", "stairRegions", "unknownAreas"])
        for (const x of r[group]) {
          for (const k of ["x", "y", "w", "h"]) assert(Number.isFinite(x[k]));
          assert(x.w > 0 && x.h > 0);
          assert(x.x >= r.bounds.x && x.y >= r.bounds.y);
          assert(x.x + x.w <= r.bounds.x + r.bounds.w);
          assert(x.y + x.h <= r.bounds.y + r.bounds.h);
          rects++;
        }
      for (const x of r.topEdges) {
        assert(
          x.w > 0 && x.x >= r.bounds.x && x.x + x.w <= r.bounds.x + r.bounds.w,
        );
        assert(x.y >= 0 && x.y <= 640);
      }
      for (const g of r.stairGuides) {
        assert(
          g.anchor.x >= r.bounds.x && g.anchor.x <= r.bounds.x + r.bounds.w,
        );
        assert(g.anchor.y >= 0 && g.anchor.y <= 640);
        stairs++;
      }
    }
    const undirected = new Map(d.rooms.map((r) => [r.id, []]));
    for (const c of d.connections) {
      const a = d.rooms.find((r) => r.id === c.from),
        b = d.rooms.find((r) => r.id === c.to);
      assert(a && b);
      for (const axis of ["x", "y"])
        assert.equal(
          a.origin[axis] + c.exit[axis],
          b.origin[axis] + c.entrance[axis],
        );
      undirected.get(a.id).push(b.id);
      undirected.get(b.id).push(a.id);
      joins++;
    }
    const visited = new Set(),
      stack = [d.rooms[0].id];
    while (stack.length) {
      const x = stack.pop();
      if (visited.has(x)) continue;
      visited.add(x);
      stack.push(...undirected.get(x));
    }
    assert.equal(
      visited.size,
      d.rooms.length,
      "All rooms must be in the supplied connected component",
    );
    for (const p of d.stagePortals) {
      assert(docs.some((s) => s.stageId === p.fromStage));
      assert(docs.some((s) => s.stageId === p.toStage));
      assert(docs.some((s) => s.rooms.some((r) => r.id === p.fromRoom)));
      assert(docs.some((s) => s.rooms.some((r) => r.id === p.toRoom)));
    }
    for (const s of d.sharedSpaces) {
      assert(ids.has(s.collisionOwner) && ids.has(s.persistenceOwner));
      assert(s.rooms.every((x) => ids.has(x)));
    }
  }
  console.log(
    `Six layouts: ${rooms} rooms, ${joins} exact two-axis joins, ${rects} bounded geometry rectangles, ${stairs} stair control guides. Graph checks passed; physics/collision accuracy remains pending.`,
  );
}
validate();
if (process.argv.includes("--render")) {
  for (const d of docs)
    fs.writeFileSync(
      `${root}/${d.stageId}.svg`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="${d.bounds.w}" height="${d.bounds.h}" viewBox="0 0 ${d.bounds.w} ${d.bounds.h}" role="img" aria-label="${escape(d.name)} neutral layout"><title>${escape(d.name)} — geometry only, runtime pending</title><rect width="100%" height="100%" fill="white"/>${drawing(d)}</svg>\n`,
    );
  const factor = 0.08,
    width = 1400;
  let y = 55,
    svg = "";
  for (const d of docs) {
    svg += `<text x="20" y="${y}" font-family="system-ui" font-size="20">${escape(d.name)} — ${d.rooms.length} rooms — ${d.bounds.w} × ${d.bounds.h}</text>`;
    y += 15;
    svg += `<g transform="translate(20 ${y}) scale(${factor})">${drawing(d)}</g>`;
    y += d.bounds.h * factor + 55;
  }
  fs.writeFileSync(
    `${root}/world-overview.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.ceil(y)}" viewBox="0 0 ${width} ${Math.ceil(y)}"><title>Six stage panels, geometry only; panel spacing is presentation</title><rect width="100%" height="100%" fill="white"/><text x="20" y="25" font-family="system-ui" font-size="16">Layout examples · gray candidate solids · amber stair regions/guides · pink unknown · cyan joins · purple shared space</text>${svg}</svg>\n`,
  );
}
