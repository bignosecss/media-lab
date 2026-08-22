import '@testing-library/jest-dom/vitest';

// Radix/Base UI primitives rely on ResizeObserver, which jsdom does not
// implement. Provide a no-op stub.
class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
