import { defineComponent, h, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { createMediaController } from '@medialab/core';
import { mediaControllerKey } from './controller.ts';

export interface MediaProviderProps {
  src?: string;
}

/**
 * Owning provider for the Vue adapter (proof-of-concept). Creates a controller,
 * attaches it to a `<video>`, and provides it to descendants via
 * `provide`/`inject`; render your controls as the default slot.
 */
export const MediaProvider = defineComponent({
  name: 'MediaProvider',
  props: {
    src: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    const controller = createMediaController();
    const mediaRef = ref<HTMLMediaElement | null>(null);
    provide(mediaControllerKey, controller);

    onMounted(() => controller.attach(mediaRef.value));
    onBeforeUnmount(() => controller.detach());

    return () => [
      h('video', { ref: mediaRef, ...(props.src ? { src: props.src } : {}) }),
      ...(slots.default?.() ?? []),
    ];
  },
});
