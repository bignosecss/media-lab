/**
 * The framework-agnostic contract for the media layer.
 *
 * `@medialab/core` is React-free. It wraps a media element and exposes a
 * typed command/state split: user intents become {@link MediaCommand}, media
 * state is a {@link MediaState} snapshot.
 */

/** A contiguous buffered range, seconds relative to the media timeline. */
export interface BufferedRange {
  start: number;
  end: number;
}

/** Immutable snapshot of the media element's observable state. The element is the source of truth; this is a projection. */
export interface MediaState {
  paused: boolean;
  /** Current playback position in seconds. */
  currentTime: number;
  /** Total duration in seconds, or `Infinity`/`NaN` when unknown. */
  duration: number;
  /** 0..1. */
  volume: number;
  muted: boolean;
  playbackRate: number;
  ended: boolean;
  /** Buffered ranges in seconds. */
  buffered: BufferedRange[];
  /** True while the element is waiting for data. */
  buffering: boolean;
  /** A message when the element errored, else null. */
  error: string | null;
}

/** A user-intent command. Commands are the only way to mutate media. */
export type MediaCommand =
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'togglePlay' }
  | { type: 'seek'; time: number }
  | { type: 'setVolume'; value: number }
  | { type: 'setMuted'; value: boolean }
  | { type: 'toggleMute' };

/**
 * The minimal media surface the controller reads and mutates. A real
 * `HTMLMediaElement` satisfies this; a test double can too.
 */
export interface MediaElementLike {
  paused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  ended: boolean;
  buffered: { length: number; start(index: number): number; end(index: number): number };
  error?: { readonly message?: string } | null;
  addEventListener(type: string, listener: (event: Event) => void): void;
  removeEventListener(type: string, listener: (event: Event) => void): void;
  play(): Promise<void> | void;
  pause(): void;
}
