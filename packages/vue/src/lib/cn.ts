/** Join class names, dropping falsy values (React's `cn` equivalent). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
