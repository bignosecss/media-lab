import { useMediaCommand, useMediaState } from '@react-media/react';
import { cn } from './lib/cn.ts';
import { MuteIcon, VolumeIcon } from './primitives/icons.tsx';
import { Slider } from './primitives/slider.tsx';

export interface MediaVolumeProps {
  className?: string | undefined;
  /** Show a mute/unmute toggle button before the slider. Defaults to true. */
  showMuteButton?: boolean;
}

/**
 * A volume control: a mute toggle (optional) plus a slider that dispatches a
 * `setVolume` command. The slider reflects `volume` and shows `0` when muted.
 */
export function MediaVolume({ className, showMuteButton = true }: MediaVolumeProps) {
  const volume = useMediaState((state) => state.volume);
  const muted = useMediaState((state) => state.muted);
  const command = useMediaCommand();

  const displayed = muted ? 0 : volume;
  const label = muted ? 'Unmute' : 'Mute';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showMuteButton && (
        <button
          type="button"
          aria-label={label}
          onClick={() => command({ type: 'toggleMute' })}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-media-control-fg transition hover:opacity-90"
        >
          {muted ? <MuteIcon className="h-5 w-5" /> : <VolumeIcon className="h-5 w-5" />}
        </button>
      )}
      <Slider
        className="w-24"
        value={displayed}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => command({ type: 'setVolume', value })}
        aria-label="Volume"
      />
    </div>
  );
}
