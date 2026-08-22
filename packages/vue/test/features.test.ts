import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, provide, type Component } from 'vue';
import {
  createMediaController,
  type MediaElementLike,
} from '@medialab/core';
import { mediaControllerKey } from '../src/controller.ts';
import { MediaBufferedBar, MediaPlaybackRate, MediaTimeDisplay } from '../src/index.ts';

class FakeMediaElement implements MediaElementLike {
  paused = true;
  currentTime = 0;
  duration = 120;
  volume = 1;
  muted = false;
  playbackRate = 1;
  ended = false;
  buffered: MediaElementLike['buffered'] = { length: 0, start: () => 0, end: () => 0 };
  error: { readonly message?: string } | null = null;

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
    this.paused = false;
    this.emit('play');
    return Promise.resolve();
  }

  pause(): void {
    this.paused = true;
    this.emit('pause');
  }

  emit(type: string): void {
    for (const listener of this.listeners.get(type) ?? []) listener(new Event(type));
  }

  setBuffered(ranges: Array<[number, number]>): void {
    this.buffered = {
      length: ranges.length,
      start: (index: number) => ranges[index]?.[0] ?? 0,
      end: (index: number) => ranges[index]?.[1] ?? 0,
    };
    this.emit('progress');
  }
}

function mountWith(element: MediaElementLike, component: Component) {
  const controller = createMediaController();
  controller.attach(element);
  const Host = defineComponent({
    setup() {
      provide(mediaControllerKey, controller);
      return () => h(component);
    },
  });
  return { wrapper: mount(Host), element, controller };
}

describe('Vue media feature components', () => {
  it('MediaTimeDisplay renders a formatted current time and duration', async () => {
    const element = new FakeMediaElement();
    element.currentTime = 65;
    const { wrapper } = mountWith(element, MediaTimeDisplay);
    await nextTick();
    expect(wrapper.get('span').text()).toBe('1:05 / 2:00');
  });

  it('MediaTimeDisplay shows 0:00 total when the duration is unknown', async () => {
    const element = new FakeMediaElement();
    element.duration = Number.NaN;
    const { wrapper } = mountWith(element, MediaTimeDisplay);
    await nextTick();
    expect(wrapper.get('span').text()).toBe('0:00 / 0:00');
  });

  it('MediaBufferedBar renders the buffered fraction as a single segment', async () => {
    const element = new FakeMediaElement();
    element.setBuffered([[10, 30]]);
    const { wrapper } = mountWith(element, MediaBufferedBar);
    await nextTick();

    const bar = wrapper.get('div[role="presentation"]');
    expect(bar.attributes('aria-hidden')).toBe('true');

    const segments = wrapper.findAll('div.bg-media-buffer');
    expect(segments).toHaveLength(1);

    const style = segments[0]?.attributes('style') ?? '';
    const left = Number.parseFloat(style.match(/left:\s*([\d.]+)%/)?.[1] ?? '0');
    const width = Number.parseFloat(style.match(/width:\s*([\d.]+)%/)?.[1] ?? '0');
    expect(left).toBe(0);
    expect(width).toBeCloseTo((30 / 120) * 100, 1);
  });

  it('MediaPlaybackRate dispatches setPlaybackRate on change', async () => {
    const element = new FakeMediaElement();
    const { wrapper } = mountWith(element, MediaPlaybackRate);

    const select = wrapper.get('select');
    expect(select.attributes('aria-label')).toBe('Playback speed');
    expect(select.findAll('option')).toHaveLength(4);
    expect(select.element.value).toBe('1');

    await select.setValue('1.5');
    await nextTick();
    expect(element.playbackRate).toBe(1.5);
  });
});
