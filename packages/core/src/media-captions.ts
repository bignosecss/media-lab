import type { MediaCaptionsState, MediaCue, MediaTextTrack } from './types.ts';

/** The minimal surface of a DOM `TextTrack` we read. */
export interface TextTrackLike {
  id: string;
  kind: string;
  label: string;
  language: string;
  mode: string;
  activeCues?: { length: number; [index: number]: MediaCue };
}

/** The minimal surface of a DOM `TextTrackList` we read. */
export interface TextTrackListLike {
  length: number;
  [index: number]: TextTrackLike;
}

export interface MediaCaptions {
  subscribe(listener: () => void): () => void;
  getState(): MediaCaptionsState;
  setEnabled(enabled: boolean): void;
  setActiveTrack(id: string | null): void;
  /** Re-read the text-track list (called by a provider on track/load events). */
  refresh(): void;
}

const CAPTION_KINDS = ['subtitles', 'captions', 'descriptions'];

/**
 * A framework-free captions store over the media element's text tracks. This is
 * the captions analogue of the media controller: it reads the real `TextTrackList`
 * and keeps a normalized snapshot. Each framework binds its reactivity to it.
 *
 * `getTextTracks` returns the element's `TextTrackList` (or a null when the
 * element is absent); call `refresh()` via the provider when the element fires
 * `addtrack`/`removetrack`/`change`/`cuechange`.
 */
export function createMediaCaptions(getTextTracks: () => TextTrackListLike | null): MediaCaptions {
  let state: MediaCaptionsState = initialState();
  const listeners = new Set<() => void>();

  function readTracks(list: TextTrackListLike): MediaTextTrack[] {
    const tracks: MediaTextTrack[] = [];
    for (let i = 0; i < list.length; i += 1) {
      const track = list[i];
      if (!track || !CAPTION_KINDS.includes(track.kind)) continue;
      tracks.push({
        id: track.id || String(i),
        kind: track.kind,
        label: track.label,
        language: track.language,
      });
    }
    return tracks;
  }

  function readCues(track: TextTrackLike): MediaCue[] {
    const cues = track.activeCues;
    if (!cues) return [];
    const out: MediaCue[] = [];
    for (let i = 0; i < cues.length; i += 1) {
      const cue = cues[i];
      if (cue) out.push({ startTime: cue.startTime, endTime: cue.endTime, text: cue.text });
    }
    return out;
  }

  function sync(): void {
    const list = getTextTracks();
    if (!list) {
      state = initialState();
      emit();
      return;
    }
    const tracks = readTracks(list);
    let activeTrack: TextTrackLike | null = null;
    let activeTrackId: string | null = null;
    for (let i = 0; i < list.length; i += 1) {
      const track = list[i];
      if (track && track.mode === 'showing') {
        activeTrack = track;
        activeTrackId = track.id || String(i);
        break;
      }
    }
    state = {
      tracks,
      activeTrackId,
      isEnabled: activeTrack !== null,
      cues: activeTrack ? readCues(activeTrack) : [],
    };
    emit();
  }

  function emit(): void {
    for (const listener of listeners) listener();
  }

  function setEnabled(enabled: boolean): void {
    sync();
    const list = getTextTracks();
    if (!list) return;
    if (enabled) {
      // Show the active (or first subtitle/caption) track.
      const preferred = listOf(list);
      const active = preferred.find((t) => t.mode === 'showing') ?? preferred.find((t) => CAPTION_KINDS.includes(t.kind));
      if (active) {
        active.mode = 'showing';
        for (const t of preferred) if (t !== active) t.mode = 'hidden';
      }
    } else {
      for (const t of listOf(list)) t.mode = 'disabled';
    }
    sync();
  }

  function setActiveTrack(id: string | null): void {
    const list = getTextTracks();
    if (!list) return;
    const all = listOf(list);
    for (const t of all) t.mode = t.id === id || String(all.indexOf(t)) === id ? 'showing' : 'hidden';
    sync();
  }

  sync();

  return {
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState(): MediaCaptionsState {
      return state;
    },
    setEnabled,
    setActiveTrack,
    refresh: sync,
  };
}

function listOf(list: TextTrackListLike): TextTrackLike[] {
  const out: TextTrackLike[] = [];
  for (let i = 0; i < list.length; i += 1) {
    const track = list[i];
    if (track) out.push(track);
  }
  return out;
}

function initialState(): MediaCaptionsState {
  return { tracks: [], activeTrackId: null, isEnabled: false, cues: [] };
}
