import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  createMediaCaptions,
  createMediaController,
  type MediaCue,
  type TextTrackLike,
  type TextTrackListLike,
} from '@medialab/core';
import {
  MediaCaptionsButton,
  MediaTextTrackDisplay,
  MediaTextTrackSelect,
  MediaContext,
} from '../src/index.ts';

function makeTrack(
  id: string,
  label: string,
  mode = 'disabled',
  cues: MediaCue[] = [],
): TextTrackLike {
  return {
    id,
    kind: 'subtitles',
    label,
    language: 'en',
    mode,
    get activeCues() {
      return Object.assign(cues as unknown as { length: number }, { length: cues.length });
    },
  };
}

function renderWith(captions: ReturnType<typeof createMediaCaptions>, ui: React.ReactNode) {
  const controller = createMediaController();
  render(<MediaContext.Provider value={{ controller, captions }}>{ui}</MediaContext.Provider>);
}

describe('React captions components', () => {
  it('MediaCaptionsButton toggles captions', () => {
    const track = makeTrack('t1', 'English');
    const captions = createMediaCaptions(() => [track] as unknown as TextTrackListLike);
    renderWith(captions, <MediaCaptionsButton />);
    const button = screen.getByRole('button', { name: 'Turn on captions' });
    fireEvent.click(button);
    expect(track.mode).toBe('showing');
    expect(screen.getByRole('button', { name: 'Turn off captions' })).toBeTruthy();
  });

  it('MediaTextTrackSelect lists tracks and selects one', () => {
    const t1 = makeTrack('t1', 'English');
    const t2 = makeTrack('t2', 'Spanish');
    const captions = createMediaCaptions(() => [t1, t2] as unknown as TextTrackListLike);
    renderWith(captions, <MediaTextTrackSelect />);
    const select = screen.getByRole('combobox', { name: 'Captions track' });
    fireEvent.change(select, { target: { value: 't2' } });
    expect(t2.mode).toBe('showing');
    expect(t1.mode).toBe('hidden');
  });

  it('MediaTextTrackDisplay renders the active cue', () => {
    const track = makeTrack('t1', 'English', 'showing', [{ startTime: 0, endTime: 1, text: 'Hello' }]);
    const captions = createMediaCaptions(() => [track] as unknown as TextTrackListLike);
    renderWith(captions, <MediaTextTrackDisplay />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
