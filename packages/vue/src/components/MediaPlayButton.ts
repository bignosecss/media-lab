import { defineComponent, h } from 'vue';
import { useMediaCommand, useMediaState } from '../hooks.ts';
import { PauseIcon, PlayIcon } from './icons.ts';
import { cn } from '../lib/cn.ts';

/**
 * A play/pause control (Vue). Dispatches a `togglePlay` command; the
 * presentation is a default styled button with an icon.
 */
export const MediaPlayButton = defineComponent({
  name: 'MediaPlayButton',
  props: { className: { type: String, default: undefined } },
  setup(props) {
    const paused = useMediaState((s) => s.paused);
    const command = useMediaCommand();
    return () => {
      const label = paused.value ? 'Play' : 'Pause';
      return h(
        'button',
        {
          type: 'button',
          'aria-label': label,
          class: cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-full bg-media-control text-media-control-fg transition hover:opacity-90',
            props.className,
          ),
          onClick: () => command({ type: 'togglePlay' }),
        },
        [paused.value ? PlayIcon() : PauseIcon()],
      );
    };
  },
});
