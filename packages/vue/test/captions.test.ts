import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, provide } from 'vue';
import {
  createMediaCaptions,
  type MediaCue,
  type TextTrackLike,
  type TextTrackListLike,
} from '@medialab/core';
import { mediaCaptionsKey } from '../src/controller.ts';
import {
  MediaCaptionsButton,
  MediaTextTrackDisplay,
  MediaTextTrackSelect,
} from '../src/index.ts';

function makeTrack(
  id: string,
  label: string,
  mode = 'disabled',
  cues: MediaCue[] = [],
): TextTrackLike {
  return {
    id,
    kind: 'subtitles',
    label,
    language: 'en',
    mode,
    get activeCues() {
      return Object.assign(cues as unknown as { length: number }, { length: cues.length });
    },
  };
}

function host(captions: ReturnType<typeof createMediaCaptions>, component: unknown) {
  return defineComponent({
    setup() {
      provide(mediaCaptionsKey, captions);
      return () => h(component as never);
    },
  });
}

describe('Vue captions components', () => {
  it('MediaCaptionsButton toggles captions', async () => {
    const track = makeTrack('t1', 'English');
    const captions = createMediaCaptions(() => [track] as unknown as TextTrackListLike);
    const wrapper = mount(host(captions, MediaCaptionsButton));
    const button = wrapper.get('button');
    expect(button.attributes('aria-label')).toBe('Turn on captions');
    await button.trigger('click');
    await nextTick();
    expect(track.mode).toBe('showing');
    expect(wrapper.get('button').attributes('aria-label')).toBe('Turn off captions');
  });

  it('MediaTextTrackSelect lists tracks and selects one', async () => {
    const t1 = makeTrack('t1', 'English');
    const t2 = makeTrack('t2', 'Spanish');
    const captions = createMediaCaptions(() => [t1, t2] as unknown as TextTrackListLike);
    const wrapper = mount(host(captions, MediaTextTrackSelect));
    expect(wrapper.findAll('option')).toHaveLength(3);
    await wrapper.get('select').setValue('t2');
    await nextTick();
    expect(t2.mode).toBe('showing');
    expect(t1.mode).toBe('hidden');
  });

  it('MediaTextTrackDisplay renders the active cue', () => {
    const track = makeTrack('t1', 'English', 'showing', [{ startTime: 0, endTime: 1, text: 'Hello' }]);
    const captions = createMediaCaptions(() => [track] as unknown as TextTrackListLike);
    const wrapper = mount(host(captions, MediaTextTrackDisplay));
    expect(wrapper.text()).toContain('Hello');
  });
});
