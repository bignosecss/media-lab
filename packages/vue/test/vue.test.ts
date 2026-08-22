import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, provide } from 'vue';
import {
  createMediaController,
  type MediaElementLike,
  type MediaState,
} from '@react-media/core';
import { mediaControllerKey } from '../src/controller.ts';
import { useMediaCommand, useMediaState } from '../src/hooks.ts';

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

describe('Vue adapter (proof that core is framework-agnostic)', () => {
  it('binds the same core controller to Vue reactivity', async () => {
    const element = new FakeMediaElement();
    const controller = createMediaController();
    controller.attach(element);

    const Consumer = defineComponent({
      setup() {
        const paused = useMediaState((s: MediaState) => s.paused);
        const command = useMediaCommand();
        return () =>
          h('div', [
            h('span', { 'data-testid': 'paused' }, String(paused.value)),
            h('button', { onClick: () => command({ type: 'togglePlay' }) }, 'toggle'),
          ]);
      },
    });

    const Host = defineComponent({
      setup() {
        provide(mediaControllerKey, controller);
        return () => h(Consumer);
      },
    });

    const wrapper = mount(Host);

    expect(wrapper.get('[data-testid="paused"]').text()).toBe('true');

    await wrapper.find('button').trigger('click');
    await nextTick();

    expect(element.playCalls).toBe(1);
    expect(wrapper.get('[data-testid="paused"]').text()).toBe('false');
  });
});
