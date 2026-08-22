import { useMediaCommand, useMediaState } from './hooks.ts';
import { cn } from './lib/cn.ts';

/** The playback rates offered by the native `<select>`. */
const RATES = [0.5, 1, 1.5, 2] as const;

/** Pick the offered rate closest to the current one. */
function closestRate(rate: number): number {
  return RATES.reduce((best, current) =>
    Math.abs(current - rate) < Math.abs(best - rate) ? current : best,
  );
}

export interface MediaPlaybackRateProps {
  className?: string | undefined;
}

/**
 * A playback-speed control (React). Renders a native `<select>` of common rates
 * and dispatches a `setPlaybackRate` command on change. The current rate is
 * reflected as the nearest offered option.
 */
export function MediaPlaybackRate({ className }: MediaPlaybackRateProps) {
  const playbackRate = useMediaState((state) => state.playbackRate);
  const command = useMediaCommand();

  return (
    <select
      aria-label="Playback speed"
      className={cn('rounded bg-media-control px-2 py-1 text-media-control-fg', className)}
      value={closestRate(playbackRate)}
      onChange={(event) => command({ type: 'setPlaybackRate', rate: Number(event.target.value) })}
    >
      {RATES.map((rate) => (
        <option key={String(rate)} value={rate}>
          {`${rate}×`}
        </option>
      ))}
    </select>
  );
}
