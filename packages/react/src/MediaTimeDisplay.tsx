import { useMediaState } from './hooks.ts';
import { cn } from './lib/cn.ts';

/** Format seconds as `M:SS` (minutes may exceed one digit). */
function formatTime(seconds: number): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const minutes = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export interface MediaTimeDisplayProps {
  className?: string | undefined;
}

/**
 * A time display (React). Shows the current position and duration as `M:SS / M:SS`.
 * When the duration is unknown (`Infinity`, `NaN`, or non-positive) the total
 * renders as `0:00`.
 */
export function MediaTimeDisplay({ className }: MediaTimeDisplayProps) {
  const currentTime = useMediaState((state) => state.currentTime);
  const duration = useMediaState((state) => state.duration);
  const known = Number.isFinite(duration) && duration > 0;
  const total = known ? formatTime(duration) : '0:00';

  return (
    <span className={cn('font-mono tabular-nums text-media-control-fg', className)}>
      {formatTime(currentTime)} / {total}
    </span>
  );
}
