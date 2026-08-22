import { defineComponent, h } from 'vue';
import { useMediaState } from '../hooks.ts';
import { cn } from '../lib/cn.ts';

/**
 * A buffered-range indicator (Vue). Renders a full-width base track plus one
 * segment per buffered range, positioned by its `start` and spanning its
 * `(end - start)` as a fraction of the duration. Purely presentational — it
 * reads media state but dispatches no command.
 */
export const MediaBufferedBar = defineComponent({
  name: 'MediaBufferedBar',
  props: { className: { type: String, default: undefined } },
  setup(props) {
    const buffered = useMediaState((s) => s.buffered);
    const duration = useMediaState((s) => s.duration);
    return () => {
      const known = Number.isFinite(duration.value) && duration.value > 0;
      const total = known ? duration.value : 0;
      const segments = known
        ? buffered.value.map((range) => {
            const left = Math.max(0, Math.min(1, range.start / total)) * 100;
            const width = Math.max(0, Math.min(1, (range.end - range.start) / total)) * 100;
            return h('div', {
              class: 'absolute inset-y-0 bg-media-track',
              style: { left: `${left}%`, width: `${width}%` },
            });
          })
        : [];
      return h(
        'div',
        {
          role: 'presentation',
          'aria-hidden': true,
          class: cn('relative h-1.5 w-full overflow-hidden rounded-full bg-media-track/40', props.className),
        },
        segments,
      );
    };
  },
});
