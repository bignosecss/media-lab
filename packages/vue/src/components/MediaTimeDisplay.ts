import { defineComponent, h } from 'vue';
import { useMediaState } from '../hooks.ts';

/** Format seconds as `M:SS` (minutes may exceed one digit). */
function formatTime(seconds: number): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const minutes = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * A time display (Vue). Shows the current position and duration as `M:SS / M:SS`.
 * When the duration is unknown (`Infinity`, `NaN`, or non-positive) the total
 * renders as `0:00`.
 */
export const MediaTimeDisplay = defineComponent({
  name: 'MediaTimeDisplay',
  setup() {
    const currentTime = useMediaState((s) => s.currentTime);
    const duration = useMediaState((s) => s.duration);
    return () => {
      const known = Number.isFinite(duration.value) && duration.value > 0;
      const total = known ? formatTime(duration.value) : '0:00';
      return h(
        'span',
        { class: 'font-mono text-media-control-fg tabular-nums' },
        [`${formatTime(currentTime.value)} / ${total}`],
      );
    };
  },
});
