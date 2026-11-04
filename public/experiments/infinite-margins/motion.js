/** Standalone explanatory demo, not the production reader.
 * Reference: apps/linea-web/src/canvas/camera.ts on codex/scoped-reading-canvas.
 * Uses its centre-origin camera, geometric scale / pan-linear-in-scale flight,
 * inward over-page detent, and 300ms continuous-gesture quiet requirement.
 * The companion demo tests cover the Spring landing and gesture hold. */
export const FIT = { pan: { x: 0, y: 0 }, scale: 1 };
export const QUIET_MS = 300;
const quadratic = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
export const treatments = [
  { id: 'magnet', name: 'Magnet', duration: 230, verb: 'A coordinated pull', description: 'Builds speed, then draws the page into its place. The original reference.' },
  { id: 'spring', name: 'Spring', duration: 320, verb: 'A small rebound', description: 'Goes just past fit, then comes back. A little physical give.' },
  { id: 'cushion', name: 'Cushion', duration: 440, verb: 'A soft catch', description: 'Arrives quickly at first, then eases into a long, quiet finish.' },
  { id: 'snap', name: 'Snap', duration: 140, verb: 'A precise capture', description: 'A short, decisive arrival. No overshoot, very little ceremony.' },
];
export function interpolate(from, to, progress, treatment = 'magnet') {
  const t = Math.max(0, Math.min(1, progress));
  if (t === 0) return from;
  if (t === 1) return to;
  let eased = quadratic(t);
  if (treatment === 'cushion') {
    const catchAt = value => 1 - (1 + 6 * value) * Math.exp(-6 * value);
    eased = catchAt(t) / catchAt(1);
  }
  if (treatment === 'snap') eased = 1 - (1 - t) ** 3;
  let scale = from.scale * Math.pow(to.scale / from.scale, eased);
  // A bounded presentation overshoot only; the actual destination stays fit.
  if (treatment === 'spring' && from.scale < 1 && to.scale === 1) {
    const peak = 1.012;
    scale = t < .64
      ? from.scale * Math.pow(peak / from.scale, quadratic(t / .64))
      : peak * Math.pow(1 / peak, quadratic((t - .64) / .36));
  }
  const difference = to.scale - from.scale;
  const fraction = Math.abs(difference) > .001 ? (scale - from.scale) / difference : eased;
  return { scale, pan: { x: from.pan.x + (to.pan.x - from.pan.x) * fraction, y: from.pan.y + (to.pan.y - from.pan.y) * fraction } };
}
export function zoomAround(camera, scale, anchor) {
  const next = Math.max(.12, Math.min(6, scale)), ratio = next / camera.scale;
  return { scale: next, pan: { x: anchor.x - (anchor.x - camera.pan.x) * ratio, y: anchor.y - (anchor.y - camera.pan.y) * ratio } };
}
export function overPage(camera, anchor, size) {
  return Math.abs((anchor.x - camera.pan.x) / camera.scale) <= size.width / 2 && Math.abs((anchor.y - camera.pan.y) / camera.scale) <= size.height / 2;
}
export function gestureStep(state, scale, anchor, now, isOverPage) {
  if (state.latched && now - state.lastAt < QUIET_MS) return { camera: FIT, latched: true, lastAt: now };
  if (state.camera.scale < 1 && scale >= 1 - 1e-9 && isOverPage) return { camera: FIT, latched: true, lastAt: now };
  if (state.camera.scale > 1 && scale < 1) return { camera: FIT, latched: false, lastAt: now };
  return { camera: zoomAround(state.camera, scale, anchor), latched: false, lastAt: now };
}

// A newly initiated gesture can release a prior fit hold after quiet.
// Call only at stream start, never on continuing move events.
export function beginGesture(state, now) {
  return state.latched && now - state.lastAt >= QUIET_MS
    ? { ...state, latched: false } : state;
}
