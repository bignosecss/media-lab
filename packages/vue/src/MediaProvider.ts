import { defineComponent, h, onBeforeUnmount, onMounted, provide, reactive, ref } from 'vue';
import { createMediaController } from '@medialab/core';
import { mediaControllerKey, mediaFullscreenKey, type MediaFullscreen } from './controller.ts';

export interface MediaProviderProps {
  src?: string;
  /** Class applied to the container element the provider renders (the fullscreen target). */
  containerClassName?: string;
}

/**
 * Owning provider for the Vue adapter. Creates a controller, attaches it to a
 * `<video>`, owns a container element (the fullscreen target), and provides the
 * controller + fullscreen state to descendants via `provide`/`inject`; render
 * your controls as the default slot.
 */
export const MediaProvider = defineComponent({
  name: 'MediaProvider',
  props: {
    src: { type: String, default: undefined },
    containerClassName: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    const controller = createMediaController();
    const mediaRef = ref<HTMLMediaElement | null>(null);
    const containerRef = ref<HTMLDivElement | null>(null);

    const fullscreen = reactive<MediaFullscreen>({
      isFullscreen: false,
      isSupported: document.fullscreenEnabled,
      toggle: () => {
        const container = containerRef.value;
        if (!container) return;
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        } else {
          void container.requestFullscreen();
        }
      },
    });

    provide(mediaControllerKey, controller);
    provide(mediaFullscreenKey, fullscreen);

    const onFullscreenChange = () => {
      fullscreen.isFullscreen = document.fullscreenElement === containerRef.value;
    };

    onMounted(() => {
      controller.attach(mediaRef.value);
      document.addEventListener('fullscreenchange', onFullscreenChange);
    });
    onBeforeUnmount(() => {
      controller.detach();
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    });

    return () =>
      h(
        'div',
        { ref: containerRef, class: props.containerClassName },
        [
          h('video', { ref: mediaRef, ...(props.src ? { src: props.src } : {}) }),
          ...(slots.default?.() ?? []),
        ],
      );
  },
});
