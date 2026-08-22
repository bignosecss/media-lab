import {
  MediaPlaybackRate,
  MediaPlayButton,
  MediaProgress,
  MediaProvider,
  MediaTimeDisplay,
  MediaVolume,
} from '@medialab/react';

const SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export default function ReactPlayer() {
  return (
    <MediaProvider src={SRC} playsInline>
      <div className="flex items-center gap-3 rounded-2xl bg-media-control p-3">
        <MediaPlayButton />
        <MediaTimeDisplay />
        <div className="flex-1">
          <MediaProgress />
        </div>
        <MediaVolume />
        <MediaPlaybackRate />
      </div>
    </MediaProvider>
  );
}
