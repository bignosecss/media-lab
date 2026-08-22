import type { ReactNode } from 'react';
import { useMediaCommand, useMediaState } from '@react-media/react';
import { cn } from './lib/cn.ts';
import { PauseIcon, PlayIcon } from './primitives/icons.tsx';

export interface MediaPlayButtonProps {
  className?: string | undefined;
  /** Replace the default button. Receives the current pause state. */
  children?: (state: { paused: boolean }) => ReactNode;
}

/**
 * A play/pause control. Dispatches a `togglePlay` command; the presentation is
 * the default button (with an icon) unless a `children` render prop is given.
 */
export function MediaPlayButton({ className, children }: MediaPlayButtonProps) {
  const paused = useMediaState((state) => state.paused);
  const command = useMediaCommand();

  if (children) {
    return <>{children({ paused })}</>;
  }

  const label = paused ? 'Play' : 'Pause';
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => command({ type: 'togglePlay' })}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full bg-media-control text-media-control-fg transition hover:opacity-90',
        className,
      )}
    >
      {paused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
    </button>
  );
}
