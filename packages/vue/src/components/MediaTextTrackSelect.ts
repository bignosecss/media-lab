import { defineComponent, h } from 'vue';
import { cn } from '../lib/cn.ts';
import { useMediaCaptions } from '../controller.ts';

/** A captions track selector (Vue). Choosing a track shows it; "Off" disables captions. */
export const MediaTextTrackSelect = defineComponent({
  name: 'MediaTextTrackSelect',
  props: { className: { type: String, default: undefined } },
  setup(props) {
    const captions = useMediaCaptions();
    return () =>
      h(
        'select',
        {
          'aria-label': 'Captions track',
          class: cn('rounded bg-media-control px-2 py-1 text-media-control-fg', props.className),
          value: captions.activeTrackId ?? '',
          onChange: (e: Event) =>
            captions.setActiveTrack((e.target as HTMLSelectElement).value || null),
        },
        [
          h('option', { value: '' }, 'Off'),
          ...captions.tracks.map((track) =>
            h('option', { value: track.id, key: track.id }, track.label || track.language),
          ),
        ],
      );
  },
});
