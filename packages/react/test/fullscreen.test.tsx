import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMediaController } from '@medialab/core';
import { MediaContext, MediaFullscreenButton } from '../src/index.ts';

describe('MediaFullscreenButton (React)', () => {
  it('toggles fullscreen via the provider context', () => {
    const toggle = vi.fn();
    const controller = createMediaController();
    render(
      <MediaContext.Provider
        value={{ controller, fullscreen: { isFullscreen: false, toggle, isSupported: true } }}
      >
        <MediaFullscreenButton />
      </MediaContext.Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Fullscreen' }));
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('reflects isFullscreen in the label', () => {
    const controller = createMediaController();
    render(
      <MediaContext.Provider
        value={{ controller, fullscreen: { isFullscreen: true, toggle: vi.fn(), isSupported: true } }}
      >
        <MediaFullscreenButton />
      </MediaContext.Provider>,
    );
    expect(screen.getByRole('button', { name: 'Exit fullscreen' })).toBeTruthy();
  });
});
