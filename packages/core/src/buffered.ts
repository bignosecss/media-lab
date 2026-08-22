import type { BufferedRange } from './types.ts';

/**
 * The buffered position as a 0..1 fraction of the duration: the furthest
 * buffered end divided by the duration, clamped. Returns 0 when the duration is
 * unknown (not finite or non-positive). Both `MediaProgress` and
 * `MediaBufferedBar` derive their buffer layer from this single helper.
 */
export function computeBufferedFraction(buffered: BufferedRange[], duration: number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  const furthestEnd = buffered.reduce((max, range) => Math.max(max, range.end), 0);
  return Math.min(1, furthestEnd / duration);
}
