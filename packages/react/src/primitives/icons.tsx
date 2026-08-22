interface IconProps {
  className?: string;
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

export function VolumeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M3 9v6h4l5 5V4L7 9H3z" />
      <path d="M16.5 12a3.5 3.5 0 0 0-2-3.16v6.32A3.5 3.5 0 0 0 16.5 12z" />
      <path d="M14.5 3.6v2.02a6.5 6.5 0 0 1 0 12.76v2.02a8.5 8.5 0 0 0 0-16.8z" />
    </svg>
  );
}

export function MuteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M3 9v6h4l5 5V4L7 9H3z" />
      <path d="m16 8 6 8M22 8l-6 8" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
