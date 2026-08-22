import { defineComponent, h } from 'vue';
import { cn } from '../lib/cn.ts';
import { useMediaFullscreen } from '../controller.ts';
import { ExitFullscreenIcon, FullscreenIcon } from './icons.ts';

/**
 * A fullscreen toggle (Vue). Reads the container-level fullscreen state from the
 * provider and toggles it. Fullscreen is a container concern, so it is not
 * media-element state.
 */
export const MediaFullscreenButton = defineComponent({
  name: 'MediaFullscreenButton',
  props: { className: { type: String, default: undefined } },
  setup(props) {
    const fullscreen = useMediaFullscreen();
    return () => {
      const label = fullscreen.isFullscreen ? 'Exit fullscreen' : 'Fullscreen';
      return h(
        'button',
        {
          type: 'button',
          'aria-label': label,
          class: cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-full text-media-control-fg transition hover:opacity-90',
            props.className,
          ),
          onClick: fullscreen.toggle,
        },
        [fullscreen.isFullscreen ? ExitFullscreenIcon() : FullscreenIcon()],
      );
    };
  },
});
