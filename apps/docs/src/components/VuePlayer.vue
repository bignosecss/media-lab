<script setup lang="ts">
import {
  MediaPlaybackRate,
  MediaPlayButton,
  MediaProgress,
  MediaProvider,
  MediaTimeDisplay,
  MediaVolume,
} from '@medialab/vue';

const SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
</script>

<template>
  <MediaProvider :src="SRC">
    <div class="flex items-center gap-3 rounded-2xl bg-media-control p-3">
      <MediaPlayButton />
      <MediaTimeDisplay />
      <div class="flex-1">
        <MediaProgress />
      </div>
      <MediaVolume />
      <MediaPlaybackRate />
    </div>
  </MediaProvider>
</template>
