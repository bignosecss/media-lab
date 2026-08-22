import { useSyncExternalStore } from 'react';
import type { MediaCommand, MediaState } from '@medialab/core';
import { useMediaController } from './controller-context.ts';

/**
 * Subscribe to media state. `selector` picks a derived value; pass one that
 * returns a primitive or a memoized object to avoid re-render churn.
 */
export function useMediaState<T = MediaState>(selector?: (state: MediaState) => T): T {
  const controller = useMediaController();
  return useSyncExternalStore(
    controller.subscribe,
    () => (selector ? selector(controller.getState()) : (controller.getState() as unknown as T)),
  );
}

/** Returns a stable `dispatch` for {@link MediaCommand}. */
export function useMediaCommand(): (command: MediaCommand) => void {
  const controller = useMediaController();
  return controller.dispatch;
}

/** The attached media element, if any. This is not reactive to element identity changes. */
export function useMediaElement(): HTMLMediaElement | null {
  const controller = useMediaController();
  return controller.getMediaElement() as HTMLMediaElement | null;
}
