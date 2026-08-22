import { h } from 'vue';

export function PlayIcon() {
  return h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, class: 'h-5 w-5' }, [
    h('path', { d: 'M8 5v14l11-7z' }),
  ]);
}

export function PauseIcon() {
  return h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, class: 'h-5 w-5' }, [
    h('path', { d: 'M6 5h4v14H6zM14 5h4v14h-4z' }),
  ]);
}

export function VolumeIcon() {
  return h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, class: 'h-5 w-5' }, [
    h('path', { d: 'M3 9v6h4l5 5V4L7 9H3z' }),
    h('path', { d: 'M16.5 12a3.5 3.5 0 0 0-2-3.16v6.32A3.5 3.5 0 0 0 16.5 12z' }),
    h('path', { d: 'M14.5 3.6v2.02a6.5 6.5 0 0 1 0 12.76v2.02a8.5 8.5 0 0 0 0-16.8z' }),
  ]);
}

export function MuteIcon() {
  return h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, class: 'h-5 w-5' }, [
    h('path', { d: 'M3 9v6h4l5 5V4L7 9H3z' }),
    h('path', { d: 'm16 8 6 8M22 8l-6 8', stroke: 'currentColor', 'stroke-width': '2', fill: 'none' }),
  ]);
}
