import { computed, onScopeDispose, shallowRef, type Ref } from 'vue';
import type { MediaCommand, MediaState } from '@react-media/core';
import { useMediaController } from './controller.ts';

/**
 * Subscribe to media state. `selector` picks a derived value; pass one that
 * returns a primitive so recomputation stays cheap.
 */
export function useMediaState<T = MediaState>(selector?: (state: MediaState) => T): Ref<T> {
  const controller = useMediaController();
  const snapshot = shallowRef<MediaState>(controller.getState());
  const unsubscribe = controller.subscribe(() => {
    snapshot.value = controller.getState();
  });
  onScopeDispose(unsubscribe);
  return computed(() => (selector ? selector(snapshot.value) : (snapshot.value as unknown as T)));
}

/** Returns the controller's stable `dispatch` for {@link MediaCommand}. */
export function useMediaCommand(): (command: MediaCommand) => void {
  return useMediaController().dispatch;
}

/** The attached media element, if any. This is not reactive to element identity changes. */
export function useMediaElement(): HTMLMediaElement | null {
  return useMediaController().getMediaElement() as HTMLMediaElement | null;
}
