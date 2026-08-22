import type {
  BufferedRange,
  MediaCommand,
  MediaElementLike,
  MediaState,
} from './types.ts';

/** Native media events the controller mirrors into {@link MediaState}. */
const EVENT_TYPES = [
  'play',
  'pause',
  'timeupdate',
  'durationchange',
  'volumechange',
  'waiting',
  'playing',
  'canplay',
  'loadedmetadata',
  'ended',
  'progress',
  'error',
] as const;

export interface MediaController {
  /** Attach to a media element (or `null` to clear). The element stays the source of truth. */
  attach(element: MediaElementLike | null): void;
  detach(): void;
  /** Subscribe to state changes. Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
  getState(): MediaState;
  /** Apply a user intent. The only way to mutate media. */
  dispatch(command: MediaCommand): void;
  getMediaElement(): MediaElementLike | null;
}

export function createMediaController(): MediaController {
  let element: MediaElementLike | null = null;
  let state: MediaState = initialState();
  let buffering = false;
  const listeners = new Set<() => void>();

  function readBuffered(el: MediaElementLike): BufferedRange[] {
    const ranges = el.buffered;
    const out: BufferedRange[] = [];
    for (let i = 0; i < ranges.length; i += 1) {
      out.push({ start: ranges.start(i), end: ranges.end(i) });
    }
    return out;
  }

  function readState(el: MediaElementLike): MediaState {
    return {
      paused: el.paused,
      currentTime: el.currentTime,
      duration: el.duration,
      volume: el.volume,
      muted: el.muted,
      playbackRate: el.playbackRate,
      ended: el.ended,
      buffered: readBuffered(el),
      buffering,
      error: el.error?.message ?? null,
    };
  }

  function emit(): void {
    for (const listener of listeners) listener();
  }

  function sync(): void {
    if (!element) return;
    state = readState(element);
    emit();
  }

  function handleEvent(event: Event): void {
    switch (event.type) {
      case 'waiting':
        buffering = true;
        break;
      case 'playing':
      case 'canplay':
        buffering = false;
        break;
      default:
        break;
    }
    sync();
  }

  function detach(): void {
    if (!element) return;
    for (const type of EVENT_TYPES) element.removeEventListener(type, handleEvent);
    element = null;
    buffering = false;
    state = initialState();
    emit();
  }

  function attach(el: MediaElementLike | null): void {
    if (element === el) return;
    detach();
    element = el;
    if (!element) {
      state = initialState();
      buffering = false;
      emit();
      return;
    }
    for (const type of EVENT_TYPES) element.addEventListener(type, handleEvent);
    sync();
  }

  function dispatch(command: MediaCommand): void {
    if (!element) return;
    switch (command.type) {
      case 'play':
        void element.play();
        break;
      case 'pause':
        element.pause();
        break;
      case 'togglePlay':
        if (element.paused) {
          void element.play();
        } else {
          element.pause();
        }
        break;
      case 'seek':
        element.currentTime = clamp(
          command.time,
          0,
          Number.isFinite(element.duration) ? element.duration : Number.MAX_SAFE_INTEGER,
        );
        break;
      case 'setVolume':
        element.volume = clamp(command.value, 0, 1);
        break;
      case 'setMuted':
        element.muted = command.value;
        break;
      case 'toggleMute':
        element.muted = !element.muted;
        break;
    }
    sync();
  }

  return {
    attach,
    detach,
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState(): MediaState {
      return state;
    },
    dispatch,
    getMediaElement(): MediaElementLike | null {
      return element;
    },
  };
}

function initialState(): MediaState {
  return {
    paused: true,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    playbackRate: 1,
    ended: false,
    buffered: [],
    buffering: false,
    error: null,
  };
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
