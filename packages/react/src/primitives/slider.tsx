import { Slider as SliderPrimitive } from '@base-ui-components/react/slider';
import { cn } from '../lib/cn.ts';

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string | undefined;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** 0..1 fraction of the track that is buffered, shown behind the played fill. */
  buffered?: number;
}

/**
 * Presentational single-thumb slider wrapping Base UI's Slider.
 * Carries keyboard navigation and ARIA slider semantics; the media-specific
 * wiring (which command to dispatch) stays in the controller components.
 */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  className,
  buffered,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={(next) => onChange(next)}
      min={min}
      max={max}
      step={step}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none select-none items-center">
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-media-track">
          {buffered !== undefined && buffered > 0 && (
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 bg-media-buffer"
              style={{ width: `${Math.min(1, buffered) * 100}%` }}
            />
          )}
          <SliderPrimitive.Indicator className="absolute h-full bg-media-accent" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-media-accent bg-white shadow focus:outline-none focus:ring-2 focus:ring-media-accent"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}
