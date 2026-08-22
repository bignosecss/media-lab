import { createContext, useContext } from 'react';
import type { MediaController } from '@medialab/core';

/** Fullscreen capability exposed by the provider (a container-level concern, not media-element state). */
export interface MediaFullscreen {
  isFullscreen: boolean;
  toggle: () => void;
  isSupported: boolean;
}

const defaultFullscreen: MediaFullscreen = {
  isFullscreen: false,
  toggle: () => {},
  isSupported: false,
};

export interface MediaContextValue {
  controller: MediaController;
  /** Present when a `<MediaProvider>` is mounted; defaults to a no-op otherwise. */
  fullscreen?: MediaFullscreen;
}

export const MediaContext = createContext<MediaContextValue | null>(null);

/** Access the controller. Must be called within a `<MediaProvider>`. */
export function useMediaController(): MediaController {
  const value = useContext(MediaContext);
  if (!value) {
    throw new Error('useMediaController must be used within a <MediaProvider>.');
  }
  return value.controller;
}

/** Access fullscreen state + toggle. Use within a `<MediaProvider>` (or a context that supplies it). */
export function useMediaFullscreen(): MediaFullscreen {
  const value = useContext(MediaContext);
  if (!value) throw new Error('useMediaFullscreen must be used within a <MediaProvider>.');
  return value.fullscreen ?? defaultFullscreen;
}
