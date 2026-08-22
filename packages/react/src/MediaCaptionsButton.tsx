import { useMediaCaptions } from './hooks.ts';
import { cn } from './lib/cn.ts';

export interface MediaCaptionsButtonProps {
  className?: string | undefined;
}

/** A captions on/off toggle (React). Dispatches a `setEnabled` on the captions store. */
export function MediaCaptionsButton({ className }: MediaCaptionsButtonProps) {
  const { isEnabled, setEnabled } = useMediaCaptions();
  const label = isEnabled ? 'Turn off captions' : 'Turn on captions';
  return (
    <button
      type="button"
      aria-pressed={isEnabled}
      aria-label={label}
      onClick={() => setEnabled(!isEnabled)}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-semibold text-media-control-fg transition hover:opacity-90',
        isEnabled && 'bg-media-accent text-white',
        className,
      )}
    >
      CC
    </button>
  );
}
