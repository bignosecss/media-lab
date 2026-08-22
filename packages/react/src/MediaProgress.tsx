import { computeBufferedFraction } from '@medialab/core';
import { useMediaCommand, useMediaState } from './hooks.ts';
import { Slider } from './primitives/slider.tsx';

export interface MediaProgressProps {
  className?: string | undefined;
}

/**
 * A seek control. Dispatches a `seek` command on change; the slider position is
 * driven by the media element's `currentTime` and `duration`. The buffered range
 * is rendered as a lighter segment inside the same track, behind the played fill.
 */
export function MediaProgress({ className }: MediaProgressProps) {
  const currentTime = useMediaState((state) => state.currentTime);
  const duration = useMediaState((state) => state.duration);
  const buffered = useMediaState((state) => state.buffered);
  const command = useMediaCommand();

  const max = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const bufferedFraction = computeBufferedFraction(buffered, max);

  return (
    <Slider
      className={className}
      value={currentTime}
      min={0}
      max={max}
      step={0.1}
      buffered={bufferedFraction}
      onChange={(time) => command({ type: 'seek', time })}
      aria-label="Seek"
    />
  );
}
