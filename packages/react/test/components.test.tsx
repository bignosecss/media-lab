import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  createMediaController,
  type MediaElementLike,
} from '@medialab/core';
import { MediaContext, MediaPlayButton, MediaProgress, MediaVolume } from '../src/index.ts';

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

function setup() {
  const element = new FakeMediaElement();
  const controller = createMediaController();
  controller.attach(element);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MediaContext.Provider value={{ controller }}>{children}</MediaContext.Provider>
  );
  return { element, controller, wrapper };
}

describe('controller components', () => {
  it('MediaPlayButton toggles play/pause', () => {
    const { element, wrapper } = setup();
    render(<MediaPlayButton />, { wrapper });
    expect(screen.getByRole('button', { name: 'Play' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(element.playCalls).toBe(1);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeTruthy();
  });

  it('MediaProgress reflects duration through the seek slider', () => {
    const { wrapper } = setup();
    render(<MediaProgress />, { wrapper });
    const slider = screen.getByRole('slider', { name: 'Seek' });
    expect(slider).toBeTruthy();
    expect(slider.getAttribute('max')).toBe('120');
    expect(slider.getAttribute('aria-valuenow')).toBe('0');
  });

  it('MediaVolume toggles mute and reflects the muted value', () => {
    const { element, wrapper } = setup();
    render(<MediaVolume />, { wrapper });
    expect(screen.getByRole('button', { name: 'Mute' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Mute' }));
    expect(element.muted).toBe(true);
    expect(screen.getByRole('button', { name: 'Unmute' })).toBeTruthy();
  });
});
