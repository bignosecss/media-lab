import { inject, type InjectionKey } from 'vue';
import type { MediaController } from '@react-media/core';

/** Injection key under which a `<MediaProvider>` exposes the controller. */
export const mediaControllerKey: InjectionKey<MediaController> = Symbol('mediaController');

/** Access the controller. Must be used within a `<MediaProvider>`. */
export function useMediaController(): MediaController {
  const controller = inject(mediaControllerKey);
  if (!controller) {
    throw new Error('useMediaController must be used within a <MediaProvider>.');
  }
  return controller;
}
