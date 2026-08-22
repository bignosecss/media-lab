import { defineComponent, h } from 'vue';
import { useMediaCommand, useMediaState } from '../hooks.ts';
import { cn } from '../lib/cn.ts';

/** The playback rates offered by the native `<select>`. */
const RATES = [0.5, 1, 1.5, 2] as const;

/** Pick the offered rate closest to the current one. */
function closestRate(rate: number): number {
  return RATES.reduce((best, current) =>
    Math.abs(current - rate) < Math.abs(best - rate) ? current : best,
  );
}

/**
 * A playback-speed control (Vue). Renders a native `<select>` of common rates
 * and dispatches a `setPlaybackRate` command on change. The current rate is
 * reflected as the nearest offered option.
 */
export const MediaPlaybackRate = defineComponent({
  name: 'MediaPlaybackRate',
  props: { className: { type: String, default: undefined } },
  setup(props) {
    const playbackRate = useMediaState((s) => s.playbackRate);
    const command = useMediaCommand();
    return () =>
      h(
        'select',
        {
          class: cn('rounded bg-media-control px-2 py-1 text-media-control-fg', props.className),
          'aria-label': 'Playback speed',
          value: closestRate(playbackRate.value),
          onChange: (e: Event) => {
            const rate = Number((e.target as HTMLSelectElement).value);
            command({ type: 'setPlaybackRate', rate });
          },
        },
        RATES.map((rate) =>
          h('option', { value: rate, key: String(rate) }, [`${rate}×`]),
        ),
      );
  },
});
