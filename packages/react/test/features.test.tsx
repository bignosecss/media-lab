import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  createMediaController,
  type MediaElementLike,
} from '@medialab/core';
import {
  MediaBufferedBar,
  MediaPlaybackRate,
  MediaTimeDisplay,
  MediaContext,
} from '../src/index.ts';

class FakeMediaElement implements MediaElementLike {
  paused = true;
  currentTime = 65;
  duration = 120;
  volume = 1;
  muted = false;
  playbackRate = 1;
  ended = false;
  buffered = { length: 0, start: () => 0, end: () => 0 };
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
}

function setup(element = new FakeMediaElement()) {
  const controller = createMediaController();
  controller.attach(element);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MediaContext.Provider value={{ controller }}>{children}</MediaContext.Provider>
  );
  return { element, wrapper };
}

describe('React feature components', () => {
  it('MediaTimeDisplay renders current and total time', () => {
    const { wrapper } = setup();
    render(<MediaTimeDisplay />, { wrapper });
    expect(screen.getByText('1:05 / 2:00')).toBeTruthy();
  });

  it('MediaBufferedBar renders a segment per buffered range', () => {
    const element = new FakeMediaElement();
    element.buffered = { length: 1, start: () => 0, end: () => 30 };
    const { wrapper } = setup(element);
    const { container } = render(<MediaBufferedBar />, { wrapper });
    expect(screen.getByTestId('media-buffered-bar')).toBeTruthy();
    expect(container.querySelectorAll('[data-testid="media-buffered-segment"]')).toHaveLength(1);
  });

  it('MediaPlaybackRate dispatches a setPlaybackRate command', () => {
    const element = new FakeMediaElement();
    const { wrapper } = setup(element);
    render(<MediaPlaybackRate />, { wrapper });
    const select = screen.getByRole('combobox', { name: 'Playback speed' });
    fireEvent.change(select, { target: { value: '1.5' } });
    expect(element.playbackRate).toBe(1.5);
  });
});
