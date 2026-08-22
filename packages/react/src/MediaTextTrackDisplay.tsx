import { useMediaCaptions } from './hooks.ts';
import { cn } from './lib/cn.ts';

export interface MediaTextTrackDisplayProps {
  className?: string | undefined;
}

/** Shows the current active cue as an overlay (React). Renders nothing when no cue is active. */
export function MediaTextTrackDisplay({ className }: MediaTextTrackDisplayProps) {
  const { cues } = useMediaCaptions();
  const active = cues[cues.length - 1];
  if (!active) return null;

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4 text-center text-lg font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]',
        className,
      )}
    >
      <span className="rounded bg-black/50 px-2 py-1">{active.text}</span>
    </div>
  );
}
