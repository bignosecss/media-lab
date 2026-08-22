import { useMediaFullscreen } from './controller-context.ts';
import { cn } from './lib/cn.ts';
import { ExitFullscreenIcon, FullscreenIcon } from './primitives/icons.tsx';

export interface MediaFullscreenButtonProps {
  className?: string | undefined;
}

/**
 * A fullscreen toggle (React). Reads the container-level fullscreen state from
 * the provider and toggles it. Fullscreen is a container concern, so it is not
 * media-element state.
 */
export function MediaFullscreenButton({ className }: MediaFullscreenButtonProps) {
  const { isFullscreen, toggle } = useMediaFullscreen();
  const label = isFullscreen ? 'Exit fullscreen' : 'Fullscreen';

  return (
    <button
      type="button"
      aria-label={label}
      onClick={toggle}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full text-media-control-fg transition hover:opacity-90',
        className,
      )}
    >
      {isFullscreen ? (
        <ExitFullscreenIcon className="h-5 w-5" />
      ) : (
        <FullscreenIcon className="h-5 w-5" />
      )}
    </button>
  );
}
