import { defineComponent, h } from 'vue';
import { useMediaCommand, useMediaState } from '../hooks.ts';
import { MuteIcon, VolumeIcon } from './icons.ts';

/**
 * A volume control (Vue): a mute toggle plus a native range slider that
 * dispatches a `setVolume` command. The slider reflects `volume` and shows `0`
 * when muted.
 */
export const MediaVolume = defineComponent({
  name: 'MediaVolume',
  setup() {
    const volume = useMediaState((s) => s.volume);
    const muted = useMediaState((s) => s.muted);
    const command = useMediaCommand();
    return () => {
      const displayed = muted.value ? 0 : volume.value;
      const label = muted.value ? 'Unmute' : 'Mute';
      return h('div', { class: 'flex items-center gap-2' }, [
        h(
          'button',
          {
            type: 'button',
            'aria-label': label,
            class:
              'inline-flex h-9 w-9 items-center justify-center rounded-full text-media-control-fg transition hover:opacity-90',
            onClick: () => command({ type: 'toggleMute' }),
          },
          [muted.value ? MuteIcon() : VolumeIcon()],
        ),
        h('input', {
          type: 'range',
          class: 'w-24 accent-media-accent',
          min: 0,
          max: 1,
          step: 0.01,
          value: displayed,
          'aria-label': 'Volume',
          onInput: (e: Event) =>
            command({ type: 'setVolume', value: Number((e.target as HTMLInputElement).value) }),
        }),
      ]);
    };
  },
});
