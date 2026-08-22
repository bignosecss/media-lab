import { computeBufferedFraction } from '@medialab/core';
import { defineComponent, h } from 'vue';
import { useMediaState } from '../hooks.ts';
import { cn } from '../lib/cn.ts';

/**
 * A buffered indicator (Vue). Derives its buffer layer from the same
 * `computeBufferedFraction` helper the media progress uses, so the two never
 * drift. Purely presentational — it reads media state but dispatches no command.
 */
export const MediaBufferedBar = defineComponent({
  name: 'MediaBufferedBar',
  props: { className: { type: String, default: undefined } },
  setup(props) {
    const buffered = useMediaState((s) => s.buffered);
    const duration = useMediaState((s) => s.duration);
    return () => {
      const fraction = computeBufferedFraction(buffered.value, duration.value);
      return h(
        'div',
        {
          role: 'presentation',
          'aria-hidden': true,
          class: cn('relative h-1.5 w-full overflow-hidden rounded-full bg-media-track/40', props.className),
        },
        [
          fraction > 0 &&
            h('div', {
              class: 'absolute inset-y-0 left-0 bg-media-buffer',
              style: { width: `${fraction * 100}%` },
            }),
        ],
      );
    };
  },
});
