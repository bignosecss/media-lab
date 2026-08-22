import { defineComponent, h } from 'vue';
import { useMediaCommand, useMediaState } from '../hooks.ts';
import { PauseIcon, PlayIcon } from './icons.ts';

/**
 * A play/pause control (Vue). Dispatches a `togglePlay` command; the
 * presentation is a default styled button with an icon.
 */
export const MediaPlayButton = defineComponent({
  name: 'MediaPlayButton',
  setup() {
    const paused = useMediaState((s) => s.paused);
    const command = useMediaCommand();
    return () => {
      const label = paused.value ? 'Play' : 'Pause';
      return h(
        'button',
        {
          type: 'button',
          'aria-label': label,
          class:
            'inline-flex h-10 w-10 items-center justify-center rounded-full bg-media-control text-media-control-fg transition hover:opacity-90',
          onClick: () => command({ type: 'togglePlay' }),
        },
        [paused.value ? PlayIcon() : PauseIcon()],
      );
    };
  },
});
