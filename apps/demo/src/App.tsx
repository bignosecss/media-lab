import type { Ref } from 'react';
import {
  MediaPlayButton,
  MediaProgress,
  MediaProvider,
  MediaVolume,
} from '@react-media/react';

const SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
      <div className="w-full max-w-3xl">
        <MediaProvider
          src={SRC}
          playsInline
          renderMedia={({ ref, mediaProps }) => (
            <video
              ref={ref as Ref<HTMLVideoElement>}
              {...mediaProps}
              className="aspect-video w-full bg-black"
            />
          )}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-black/60 p-3">
            <MediaPlayButton />
            <div className="flex-1">
              <MediaProgress />
            </div>
            <MediaVolume />
          </div>
        </MediaProvider>
      </div>
    </div>
  );
}
