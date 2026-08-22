import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, provide } from 'vue';
import { mediaFullscreenKey } from '../src/controller.ts';
import { MediaFullscreenButton } from '../src/index.ts';

describe('MediaFullscreenButton (Vue)', () => {
  it('toggles fullscreen via the provided fullscreen state', async () => {
    const toggle = vi.fn();
    const Host = defineComponent({
      setup() {
        provide(mediaFullscreenKey, { isFullscreen: false, toggle, isSupported: true });
        return () => h(MediaFullscreenButton);
      },
    });
    const wrapper = mount(Host);
    const button = wrapper.get('button');
    expect(button.attributes('aria-label')).toBe('Fullscreen');
    await button.trigger('click');
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('reflects isFullscreen in the label', () => {
    const Host = defineComponent({
      setup() {
        provide(mediaFullscreenKey, { isFullscreen: true, toggle: vi.fn(), isSupported: true });
        return () => h(MediaFullscreenButton);
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.get('button').attributes('aria-label')).toBe('Exit fullscreen');
  });
});
