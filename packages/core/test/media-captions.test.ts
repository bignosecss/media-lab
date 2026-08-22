import { describe, expect, it } from 'vitest';
import {
  createMediaCaptions,
  type MediaCue,
  type TextTrackLike,
  type TextTrackListLike,
} from '../src/index.ts';

function toCueList(cues: MediaCue[]): { length: number; [index: number]: MediaCue } {
  const list = { length: cues.length } as { length: number; [index: number]: MediaCue };
  cues.forEach((cue, i) => {
    list[i] = cue;
  });
  return list;
}

function makeTrack(init: {
  id?: string;
  kind?: string;
  label?: string;
  language?: string;
  mode?: string;
  cues?: MediaCue[];
}): TextTrackLike & { setCues(cues: MediaCue[]): void } {
  let activeCues = toCueList(init.cues ?? []);
  return {
    id: init.id ?? '',
    kind: init.kind ?? 'subtitles',
    label: init.label ?? 'English',
    language: init.language ?? 'en',
    mode: init.mode ?? 'disabled',
    get activeCues() {
      return activeCues;
    },
    setCues(cues: MediaCue[]) {
      activeCues = toCueList(cues);
    },
  };
}

function newStore(tracks: TextTrackLike[]): ReturnType<typeof createMediaCaptions> {
  return createMediaCaptions(() => tracks as unknown as TextTrackListLike);
}

describe('createMediaCaptions', () => {
  it('lists subtitle/caption tracks and starts disabled', () => {
    const tracks = [makeTrack({ id: 't1' }), makeTrack({ id: 't2', kind: 'captions', label: 'Spanish' })];
    const captions = newStore(tracks);
    expect(captions.getState().tracks).toHaveLength(2);
    expect(captions.getState().isEnabled).toBe(false);
    expect(captions.getState().cues).toEqual([]);
  });

  it('setEnabled(true) shows the first caption track', () => {
    const t1 = makeTrack({ id: 't1' });
    const t2 = makeTrack({ id: 't2', label: 'Spanish' });
    const tracks = [t1, t2];
    const captions = newStore(tracks);
    captions.setEnabled(true);
    expect(t1.mode).toBe('showing');
    expect(t2.mode).toBe('hidden');
    expect(captions.getState().isEnabled).toBe(true);
    expect(captions.getState().activeTrackId).toBe('t1');
  });

  it('setEnabled(false) disables all tracks', () => {
    const t1 = makeTrack({ id: 't1', mode: 'showing' });
    const tracks = [t1];
    const captions = newStore(tracks);
    captions.setEnabled(false);
    expect(t1.mode).toBe('disabled');
    expect(captions.getState().isEnabled).toBe(false);
  });

  it('reads cues from the active track and setActiveTrack switches', () => {
    const t1 = makeTrack({ id: 't1' });
    const t2 = makeTrack({ id: 't2', cues: [{ startTime: 1, endTime: 2, text: 'Hola' }] });
    const tracks = [t1, t2];
    const captions = newStore(tracks);
    captions.setActiveTrack('t2');
    expect(t2.mode).toBe('showing');
    expect(t1.mode).toBe('hidden');
    expect(captions.getState().activeTrackId).toBe('t2');
    expect(captions.getState().cues).toEqual([{ startTime: 1, endTime: 2, text: 'Hola' }]);
  });

  it('notifies subscribers on change', () => {
    const t1 = makeTrack({ id: 't1' });
    const tracks = [t1];
    const captions = newStore(tracks);
    let count = 0;
    const unsubscribe = captions.subscribe(() => {
      count += 1;
    });
    captions.setEnabled(true);
    expect(count).toBeGreaterThan(0);
    unsubscribe();
  });
});
