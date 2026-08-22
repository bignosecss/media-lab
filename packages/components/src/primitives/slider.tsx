import * as SliderPrimitive from '@radix-ui/react-slider';
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
}

/**
 * Presentational single-thumb slider wrapping `@radix-ui/react-slider`.
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
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={(next) => onChange(next[0] ?? value)}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-media-track">
        <SliderPrimitive.Range className="absolute h-full bg-media-accent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className="block h-3.5 w-3.5 rounded-full border border-media-accent bg-white shadow focus:outline-none focus:ring-2 focus:ring-media-accent"
      />
    </SliderPrimitive.Root>
  );
}
