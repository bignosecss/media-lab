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
        { label: 'Intro', link: '/intro' },
        { label: 'Getting started', link: '/getting-started' },
        { label: 'Architecture', link: '/architecture' },
        { label: 'Core API', link: '/core' },
        { label: 'React', link: '/react' },
        { label: 'Vue', link: '/vue' },
        { label: 'Components', link: '/components' },
        { label: 'Design system', link: '/design-system' },
        { label: 'Playground', link: '/playground' },
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
