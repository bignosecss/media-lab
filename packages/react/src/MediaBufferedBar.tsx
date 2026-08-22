import { computeBufferedFraction } from '@medialab/core';
import { useMediaState } from './hooks.ts';
import { cn } from './lib/cn.ts';

export interface MediaBufferedBarProps {
  className?: string | undefined;
}

/**
 * A buffered indicator (React). Derives its buffer layer from the same
 * `computeBufferedFraction` helper the media progress uses, so the two never
 * drift. Purely presentational — it reads media state but dispatches no command.
 */
export function MediaBufferedBar({ className }: MediaBufferedBarProps) {
  const buffered = useMediaState((state) => state.buffered);
  const duration = useMediaState((state) => state.duration);
  const fraction = computeBufferedFraction(buffered, duration);

  return (
    <div
      role="presentation"
      aria-hidden
      data-testid="media-buffered-bar"
      className={cn(
        'relative h-1.5 w-full overflow-hidden rounded-full bg-media-track/40',
        className,
      )}
    >
      {fraction > 0 && (
        <div
          data-testid="media-buffered-segment"
          className="absolute inset-y-0 left-0 bg-media-buffer"
          style={{ width: `${fraction * 100}%` }}
        />
      )}
    </div>
  );
}
