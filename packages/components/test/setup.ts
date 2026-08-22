import '@testing-library/jest-dom/vitest';

// Radix primitives (via @radix-ui/react-use-size) rely on ResizeObserver,
// which jsdom does not implement. Provide a no-op stub.
class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
