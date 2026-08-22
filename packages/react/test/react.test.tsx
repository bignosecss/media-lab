import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  createMediaController,
  type MediaElementLike,
} from '@react-media/core';
import { MediaContext } from '../src/controller-context.ts';
import { MediaProvider } from '../src/MediaProvider.tsx';
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

function Display() {
  const state = useMediaState();
  const command = useMediaCommand();
  return (
    <div>
      <span data-testid="paused">{String(state.paused)}</span>
      <button onClick={() => command({ type: 'togglePlay' })}>toggle</button>
    </div>
  );
}

describe('react bindings', () => {
  it('reads initial state and updates on dispatched commands', () => {
    const element = new FakeMediaElement();
    const controller = createMediaController();
    controller.attach(element);

    render(
      <MediaContext.Provider value={{ controller }}>
        <Display />
      </MediaContext.Provider>,
    );

    expect(screen.getByTestId('paused')).toHaveTextContent('true');

    fireEvent.click(screen.getByText('toggle'));

    expect(element.playCalls).toBe(1);
    expect(screen.getByTestId('paused')).toHaveTextContent('false');
  });

  it('MediaProvider renders a media element and its children', () => {
    render(
      <MediaProvider>
        <span>controls</span>
      </MediaProvider>,
    );
    expect(document.querySelector('video')).toBeTruthy();
    expect(screen.getByText('controls')).toBeTruthy();
  });

  it('useMediaController throws outside a provider', () => {
    // Silence the expected React error boundary log for this assertion.
    const original = console.error;
    console.error = () => {};
    expect(() => render(<Display />)).toThrow();
    console.error = original;
  });
});
