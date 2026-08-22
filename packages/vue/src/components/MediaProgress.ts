import { defineComponent, h } from 'vue';
import { useMediaCommand, useMediaState } from '../hooks.ts';

/**
 * A seek control (Vue). Dispatches a `seek` command on input; the position is
 * driven by the media element's `currentTime` and `duration`. Uses a native
 * `<input type="range">` (accessible, keyboard-navigable).
 */
export const MediaProgress = defineComponent({
  name: 'MediaProgress',
  setup() {
    const currentTime = useMediaState((s) => s.currentTime);
    const duration = useMediaState((s) => s.duration);
    const command = useMediaCommand();
    return () => {
      const max = Number.isFinite(duration.value) && duration.value > 0 ? duration.value : 0;
      return h('input', {
        type: 'range',
        class: 'w-full accent-media-accent',
        min: 0,
        max,
        step: 0.1,
        value: currentTime.value,
        'aria-label': 'Seek',
        onInput: (e: Event) =>
          command({ type: 'seek', time: Number((e.target as HTMLInputElement).value) }),
      });
    };
  },
});
