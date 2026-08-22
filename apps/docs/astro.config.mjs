import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://medialab.dev',
  integrations: [
    starlight({
      title: 'medialab',
      description: 'A framework-agnostic media player',
      customCss: ['./src/styles/global.css'],
      sidebar: [
        {
          label: 'Guide',
          autogenerate: { directory: 'docs' },
        },
      ],
    }),
    mdx(),
    react(),
    vue(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
