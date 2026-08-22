import { inject, type InjectionKey } from 'vue';
import type { MediaController } from '@medialab/core';

/** Injection key under which a `<MediaProvider>` exposes the controller. */
export const mediaControllerKey: InjectionKey<MediaController> = Symbol('mediaController');

/** Fullscreen capability exposed by the provider (a container-level concern, not media-element state). */
export interface MediaFullscreen {
  isFullscreen: boolean;
  toggle: () => void;
  isSupported: boolean;
}

/** Injection key under which a `<MediaProvider>` exposes fullscreen state + toggle. */
export const mediaFullscreenKey: InjectionKey<MediaFullscreen> = Symbol('mediaFullscreen');

/** Access the controller. Must be used within a `<MediaProvider>`. */
export function useMediaController(): MediaController {
  const controller = inject(mediaControllerKey);
  if (!controller) {
    throw new Error('useMediaController must be used within a <MediaProvider>.');
  }
  return controller;
}

/** Access fullscreen state + toggle. Must be used within a `<MediaProvider>`. */
export function useMediaFullscreen(): MediaFullscreen {
  const fullscreen = inject(mediaFullscreenKey);
  if (!fullscreen) {
    throw new Error('useMediaFullscreen must be used within a <MediaProvider>.');
  }
  return fullscreen;
}
