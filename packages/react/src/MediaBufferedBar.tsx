import { useMediaState } from './hooks.ts';
import { cn } from './lib/cn.ts';

export interface MediaBufferedBarProps {
  className?: string | undefined;
}

/**
 * A buffered-range indicator (React). Renders a full-width base track plus one
 * segment per buffered range, positioned by its `start` and spanning its
 * `(end - start)` as a fraction of the duration. Purely presentational — it
 * reads media state but dispatches no command.
 */
export function MediaBufferedBar({ className }: MediaBufferedBarProps) {
  const buffered = useMediaState((state) => state.buffered);
  const duration = useMediaState((state) => state.duration);
  const known = Number.isFinite(duration) && duration > 0;
  const total = known ? duration : 0;

  const segments = known
    ? buffered.map((range) => {
        const left = Math.max(0, Math.min(1, range.start / total)) * 100;
        const width = Math.max(0, Math.min(1, (range.end - range.start) / total)) * 100;
        return (
          <div
            key={`${range.start}-${range.end}`}
            data-testid="media-buffered-segment"
            className="absolute inset-y-0 bg-media-track"
            style={{ left: `${left}%`, width: `${width}%` }}
          />
        );
      })
    : [];

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
      {segments}
    </div>
  );
}
