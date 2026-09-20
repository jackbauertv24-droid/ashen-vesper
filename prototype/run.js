// Carries one run across the two stage pages.
//
// The rooms are still served as separate pages, so crossing a threshold is a
// navigation. The run itself is not rebuilt: the whole world — both rooms'
// state and the player's health — is handed over through sessionStorage, so
// broken braziers, defeated guards, the opened gate, the pulled lever and the
// taken vial are all still true on the other side and on the way back.
//
// Collapsing the two pages into one seamless runtime is follow-up work; what
// is connected here is the run, not yet the rendering.
import * as world from "./world.js";

const KEY = "ashen-vesper-run";

export function save(w) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(w));
  } catch {
    /* private mode or blocked storage: the run simply does not carry */
  }
}

export function clear() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

function load() {
  try {
    const raw = sessionStorage.getItem(KEY);
    const w = raw ? JSON.parse(raw) : null;
    return w && w.rooms && w.rooms.road && w.rooms.cloister ? w : null;
  } catch {
    return null;
  }
}

/** The world for this page, resuming a run in progress when there is one. */
export function enter(roomId) {
  const w = load() || world.create(roomId);
  w.room = roomId;
  w.events = [];
  return w;
}

export const roomState = (w) => world.active(w);

/** Step the active room. Returns true when the page is navigating away. */
export function step(w, input, dt, options) {
  world.step(w, input, dt, options);
  // Surface the threshold prompt through the stage HUD that already exists.
  const s = world.active(w);
  if (w.noticeTime > s.noticeTime && w.notice) {
    s.notice = w.notice;
    s.noticeTime = w.noticeTime;
  }
  if (w.events.includes("travel")) {
    save(w);
    location.href = world.ROOMS[w.room].page;
    return true;
  }
  return false;
}

/** Start the run over, on this page's room. */
export function restart(w, roomId) {
  world.restart(w);
  w.room = roomId;
  clear();
  return world.active(w);
}
