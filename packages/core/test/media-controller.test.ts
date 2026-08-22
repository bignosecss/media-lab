import { describe, expect, it } from 'vitest';
import { createMediaController } from '../src/index.ts';
import type { MediaCommand, MediaElementLike } from '../src/index.ts';

/** A minimal test double for the media element's observable surface. */
class FakeMediaElement implements MediaElementLike {
  paused = true;
  currentTime = 0;
  duration = 120;
  volume = 1;
  muted = false;
  playbackRate = 1;
  ended = false;
  buffered = { length: 0, start: () => 0, end: () => 0 };
  error: { readonly message?: string } | null = null;

  playCalls = 0;
  pauseCalls = 0;

  private listeners = new Map<string, Array<(event: Event) => void>>();

  addEventListener(type: string, listener: (event: Event) => void): void {
    const list = this.listeners.get(type) ?? [];
    list.push(listener);
    this.listeners.set(type, list);
  }

  removeEventListener(type: string, listener: (event: Event) => void): void {
    const list = this.listeners.get(type) ?? [];
    this.listeners.set(type, list.filter((l) => l !== listener));
  }

  play(): Promise<void> {
    this.playCalls += 1;
    this.paused = false;
    this.emit('play');
    return Promise.resolve();
  }

  pause(): void {
    this.pauseCalls += 1;
    this.paused = true;
    this.emit('pause');
  }

  emit(type: string): void {
    for (const listener of this.listeners.get(type) ?? []) listener(new Event(type));
  }
}

function makeController() {
  const controller = createMediaController();
  const el = new FakeMediaElement();
  controller.attach(el);
  return { controller, el };
}

function lastState(controller: ReturnType<typeof createMediaController>) {
  return controller.getState();
}

describe('createMediaController', () => {
  it('starts with empty defaults', () => {
    const { controller } = makeController();
    expect(controller.getState()).toMatchObject({
      paused: true,
      currentTime: 0,
      volume: 1,
      muted: false,
      buffered: [],
      buffering: false,
      error: null,
    });
  });

  it('mirrors the attached element into state', () => {
    const { controller, el } = makeController();
    el.currentTime = 42;
    el.muted = true;
    controller.dispatch({ type: 'seek', time: 42 });
    expect(lastState(controller).currentTime).toBe(42);
    controller.dispatch({ type: 'setMuted', value: true });
    expect(lastState(controller).muted).toBe(true);
  });

  it('togglePlay plays when paused and pauses when playing', () => {
    const { controller, el } = makeController();
    controller.dispatch({ type: 'togglePlay' });
    expect(el.playCalls).toBe(1);
    expect(lastState(controller).paused).toBe(false);
    controller.dispatch({ type: 'togglePlay' });
    expect(el.pauseCalls).toBe(1);
    expect(lastState(controller).paused).toBe(true);
  });

  it('seek clamps to the timeline and is clamped to duration', () => {
    const { controller, el } = makeController();
    el.duration = 100;
    dispatchAndExpectTime(controller, { type: 'seek', time: 250 }, 100);
    dispatchAndExpectTime(controller, { type: 'seek', time: -5 }, 0);
  });

  it('setVolume clamps to 0..1', () => {
    const { controller, el } = makeController();
    controller.dispatch({ type: 'setVolume', value: -3 });
    expect(el.volume).toBe(0);
    controller.dispatch({ type: 'setVolume', value: 7 });
    expect(el.volume).toBe(1);
  });

  it('setPlaybackRate sets the rate on the element', () => {
    const { controller, el } = makeController();
    controller.dispatch({ type: 'setPlaybackRate', rate: 1.5 });
    expect(el.playbackRate).toBe(1.5);
    expect(lastState(controller).playbackRate).toBe(1.5);
  });

  it('notifies subscribers and unsubscribes', () => {
    const { controller, el } = makeController();
    let count = 0;
    const unsubscribe = controller.subscribe(() => {
      count += 1;
    });
    el.emit('timeupdate');
    expect(count).toBeGreaterThan(0);
    unsubscribe();
    const before = count;
    el.emit('timeupdate');
    expect(count).toBe(before);
  });

  it('tracks buffering from waiting/playing events', () => {
    const { controller, el } = makeController();
    el.emit('waiting');
    expect(lastState(controller).buffering).toBe(true);
    el.emit('playing');
    expect(lastState(controller).buffering).toBe(false);
  });

  it('exposes the attached element and detach resets state', () => {
    const { controller, el } = makeController();
    expect(controller.getMediaElement()).toBe(el);
    controller.detach();
    expect(controller.getMediaElement()).toBeNull();
    expect(controller.getState()).toMatchObject({ paused: true, buffered: [] });
  });
});

function dispatchAndExpectTime(
  controller: ReturnType<typeof createMediaController>,
  command: MediaCommand,
  expected: number,
): void {
  controller.dispatch(command);
  expect(controller.getState().currentTime).toBe(expected);
}
