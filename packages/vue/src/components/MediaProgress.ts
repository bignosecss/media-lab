import { computeBufferedFraction } from '@medialab/core';
import { defineComponent, h } from 'vue';
import { useMediaCommand, useMediaState } from '../hooks.ts';
import { cn } from '../lib/cn.ts';

/**
 * A seek control (Vue). Dispatches a `seek` command on input. Renders a single
 * track whose buffered range (lighter) sits behind the played fill (accent),
 * with a thumb, and overlays a native `<input type="range">` for keyboard and
 * ARIA slider semantics.
 */
export const MediaProgress = defineComponent({
  name: 'MediaProgress',
  props: { className: { type: String, default: undefined } },
  setup(props) {
    const currentTime = useMediaState((s) => s.currentTime);
    const duration = useMediaState((s) => s.duration);
    const buffered = useMediaState((s) => s.buffered);
    const command = useMediaCommand();

    return () => {
      const max = Number.isFinite(duration.value) && duration.value > 0 ? duration.value : 0;
      const playedPct = max > 0 ? Math.min(100, (currentTime.value / max) * 100) : 0;
      const bufferPct = computeBufferedFraction(buffered.value, max) * 100;

      return h(
        'div',
        { class: cn('relative flex h-5 w-full touch-none select-none items-center', props.className) },
        [
          h('div', { class: 'relative h-1.5 w-full overflow-hidden rounded-full bg-media-track/40' }, [
            bufferPct > 0 &&
              h('div', {
                class: 'absolute inset-y-0 left-0 bg-media-buffer',
                style: { width: `${bufferPct}%` },
              }),
            h('div', {
              class: 'absolute inset-y-0 left-0 bg-media-accent',
              style: { width: `${playedPct}%` },
            }),
          ]),
          h('input', {
            type: 'range',
            class:
              'pointer-events-auto absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0',
            min: 0,
            max,
            step: 0.1,
            value: currentTime.value,
            'aria-label': 'Seek',
            onInput: (e: Event) =>
              command({ type: 'seek', time: Number((e.target as HTMLInputElement).value) }),
          }),
          h('span', {
            class:
              'pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-media-accent bg-white shadow',
            style: { left: `${playedPct}%` },
          }),
        ],
      );
    };
  },
});
