import type { Ref } from 'react';
import {
  MediaBufferedBar,
  MediaPlaybackRate,
  MediaPlayButton,
  MediaProgress,
  MediaProvider,
  MediaTimeDisplay,
  MediaVolume,
} from '@medialab/react';

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
            <MediaTimeDisplay />
            <div className="flex-1 space-y-1">
              <MediaBufferedBar />
              <MediaProgress />
            </div>
            <MediaVolume />
            <MediaPlaybackRate />
          </div>
        </MediaProvider>
      </div>
    </div>
  );
}
