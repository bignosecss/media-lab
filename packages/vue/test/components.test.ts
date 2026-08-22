import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, provide, type Component } from 'vue';
import {
  createMediaController,
  type MediaElementLike,
} from '@medialab/core';
import { mediaControllerKey } from '../src/controller.ts';
import { MediaPlayButton, MediaProgress, MediaVolume } from '../src/index.ts';

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
    this.paused = true;
    this.emit('pause');
  }

  emit(type: string): void {
    for (const listener of this.listeners.get(type) ?? []) listener(new Event(type));
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

describe('Vue controller components', () => {
  it('MediaPlayButton toggles play/pause', async () => {
    const element = new FakeMediaElement();
    const { wrapper } = mountWith(element, MediaPlayButton);
    const button = wrapper.get('button');
    expect(button.attributes('aria-label')).toBe('Play');
    await button.trigger('click');
    await nextTick();
    expect(element.playCalls).toBe(1);
    expect(wrapper.get('button').attributes('aria-label')).toBe('Pause');
  });

  it('MediaProgress renders a native range reflecting duration', () => {
    const { wrapper } = mountWith(new FakeMediaElement(), MediaProgress);
    const input = wrapper.get('input[type="range"]');
    expect(input.attributes('aria-label')).toBe('Seek');
    expect(input.attributes('max')).toBe('120');
  });

  it('MediaVolume toggles mute', async () => {
    const element = new FakeMediaElement();
    const { wrapper } = mountWith(element, MediaVolume);
    expect(wrapper.get('button').attributes('aria-label')).toBe('Mute');
    await wrapper.get('button').trigger('click');
    await nextTick();
    expect(element.muted).toBe(true);
    expect(wrapper.get('button').attributes('aria-label')).toBe('Unmute');
  });
});
