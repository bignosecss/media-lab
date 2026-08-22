import { defineComponent, h } from 'vue';
import { cn } from '../lib/cn.ts';
import { useMediaCaptions } from '../controller.ts';

/** Shows the current active cue as an overlay (Vue). Renders nothing when no cue is active. */
export const MediaTextTrackDisplay = defineComponent({
  name: 'MediaTextTrackDisplay',
  props: { className: { type: String, default: undefined } },
  setup(props) {
    const captions = useMediaCaptions();
    return () => {
      const active = captions.cues[captions.cues.length - 1];
      if (!active) return null;
      return h(
        'div',
        {
          role: 'status',
          class: cn(
            'pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4 text-center text-lg font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]',
            props.className,
          ),
        },
        [h('span', { class: 'rounded bg-black/50 px-2 py-1' }, active.text)],
      );
    };
  },
});
