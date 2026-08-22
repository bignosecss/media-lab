import { createContext, useContext } from 'react';
import type { MediaController } from '@react-media/core';

export interface MediaContextValue {
  controller: MediaController;
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
