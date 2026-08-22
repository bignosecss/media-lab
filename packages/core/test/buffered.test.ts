import { describe, expect, it } from 'vitest';
import { computeBufferedFraction } from '../src/index.ts';

describe('computeBufferedFraction', () => {
  it('returns 0 when the duration is unknown', () => {
    expect(computeBufferedFraction([{ start: 0, end: 30 }], NaN)).toBe(0);
    expect(computeBufferedFraction([{ start: 0, end: 30 }], 0)).toBe(0);
  });

  it('computes the furthest buffered end over the duration', () => {
    expect(computeBufferedFraction([{ start: 0, end: 30 }], 120)).toBeCloseTo(0.25);
    expect(computeBufferedFraction([{ start: 0, end: 30 }, { start: 60, end: 90 }], 120)).toBeCloseTo(0.75);
  });

  it('clamps to 1', () => {
    expect(computeBufferedFraction([{ start: 0, end: 150 }], 120)).toBe(1);
  });
});
