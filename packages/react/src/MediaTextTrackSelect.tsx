import { useMediaCaptions } from './hooks.ts';
import { cn } from './lib/cn.ts';

export interface MediaTextTrackSelectProps {
  className?: string | undefined;
}

/** A captions track selector (React). Choosing a track shows it; "Off" disables captions. */
export function MediaTextTrackSelect({ className }: MediaTextTrackSelectProps) {
  const { tracks, activeTrackId, setActiveTrack } = useMediaCaptions();

  return (
    <select
      aria-label="Captions track"
      value={activeTrackId ?? ''}
      onChange={(event) => setActiveTrack(event.target.value || null)}
      className={cn('rounded bg-media-control px-2 py-1 text-media-control-fg', className)}
    >
      <option value="">Off</option>
      {tracks.map((track) => (
        <option key={track.id} value={track.id}>
          {track.label || track.language}
        </option>
      ))}
    </select>
  );
}
