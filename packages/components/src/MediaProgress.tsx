import { useMediaCommand, useMediaState } from '@react-media/react';
import { Slider } from './primitives/slider.tsx';

export interface MediaProgressProps {
  className?: string | undefined;
}

/**
 * A seek control. Dispatches a `seek` command on change; the slider position is
 * driven by the media element's `currentTime` and `duration`.
 */
export function MediaProgress({ className }: MediaProgressProps) {
  const currentTime = useMediaState((state) => state.currentTime);
  const duration = useMediaState((state) => state.duration);
  const command = useMediaCommand();

  const max = Number.isFinite(duration) && duration > 0 ? duration : 0;

  return (
    <Slider
      className={className}
      value={currentTime}
      min={0}
      max={max}
      step={0.1}
      onChange={(time) => command({ type: 'seek', time })}
      aria-label="Seek"
    />
  );
}
