import { inject, onScopeDispose, reactive, type InjectionKey } from 'vue';
import type { MediaCaptions, MediaCaptionsState, MediaController } from '@medialab/core';

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

/** Injection key under which a `<MediaProvider>` exposes the captions store. */
export const mediaCaptionsKey: InjectionKey<MediaCaptions> = Symbol('mediaCaptions');

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

/** Subscribe to captions state and expose controls. Must be used within a `<MediaProvider>`. */
export function useMediaCaptions(): MediaCaptionsState & {
  setEnabled: (enabled: boolean) => void;
  setActiveTrack: (id: string | null) => void;
} {
  const captions = inject(mediaCaptionsKey);
  if (!captions) {
    throw new Error('useMediaCaptions must be used within a <MediaProvider>.');
  }
  const view = reactive<MediaCaptionsState & { setEnabled: (e: boolean) => void; setActiveTrack: (id: string | null) => void }>({
    ...captions.getState(),
    setEnabled: captions.setEnabled,
    setActiveTrack: captions.setActiveTrack,
  });
  const unsubscribe = captions.subscribe(() => Object.assign(view, captions.getState()));
  onScopeDispose(unsubscribe);
  return view;
}
