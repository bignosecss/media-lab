import { defineComponent, h } from 'vue';
import {
  MediaPlayButton,
  MediaProgress,
  MediaProvider,
  MediaVolume,
} from '@medialab/vue';

const SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export const App = defineComponent({
  name: 'App',
  setup() {
    return () =>
      h('div', { class: 'flex min-h-screen items-center justify-center bg-zinc-950 p-8' }, [
        h('div', { class: 'w-full max-w-3xl' }, [
          h(
            MediaProvider,
            { src: SRC },
            {
              default: () =>
                h('div', { class: 'flex items-center gap-3 rounded-2xl bg-black/60 p-3' }, [
                  h(MediaPlayButton),
                  h('div', { class: 'flex-1' }, [h(MediaProgress)]),
                  h(MediaVolume),
                ]),
            },
          ),
        ]),
      ]);
  },
});
