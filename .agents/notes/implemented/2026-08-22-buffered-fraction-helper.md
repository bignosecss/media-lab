---
status: implemented
date: 2026-08-22
---

# Buffered-fraction extraction (single source)

## Context

`MediaProgress` and `MediaBufferedBar` both derived the buffered layer, but with divergent logic: `MediaProgress` used the furthest buffered end divided by duration, while `MediaBufferedBar` rendered one segment per buffered range. This duplicated the buffer math and could drift.

## Decision

Add `computeBufferedFraction(buffered, duration)` to `@medialab/core` (framework-free). Both `MediaProgress` and `MediaBufferedBar`, in React and Vue, now derive their buffer layer from this single helper. `MediaBufferedBar` renders a single buffer segment up to the furthest buffered end, matching `MediaProgress`.

## Why

One home for the buffer derivation (the shared core package), so the two components never drift. `MediaProgress` keeps buffer inside the track; `MediaBufferedBar` becomes a thin, standalone reuse of the same fraction.

## Verify

The core `buffered.test.ts` plus the React and Vue component tests assert the single-segment buffered fraction. 44 tests pass across the workspace.
