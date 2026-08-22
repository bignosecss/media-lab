import { defineComponent, h } from 'vue';
import { cn } from '../lib/cn.ts';
import { useMediaCaptions } from '../controller.ts';

/** A captions on/off toggle (Vue). Dispatches on the captions store. */
export const MediaCaptionsButton = defineComponent({
  name: 'MediaCaptionsButton',
  props: { className: { type: String, default: undefined } },
  setup(props) {
    const captions = useMediaCaptions();
    return () => {
      const label = captions.isEnabled ? 'Turn off captions' : 'Turn on captions';
      return h(
        'button',
        {
          type: 'button',
          'aria-pressed': captions.isEnabled,
          'aria-label': label,
          class: cn(
            'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-semibold text-media-control-fg transition hover:opacity-90',
            captions.isEnabled && 'bg-media-accent text-white',
            props.className,
          ),
          onClick: () => captions.setEnabled(!captions.isEnabled),
        },
        'CC',
      );
    };
  },
});
