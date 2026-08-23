import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://bignosecss.github.io/media-lab/',
  base: '/media-lab/',
  integrations: [
    starlight({
      title: 'medialab',
      description: 'A framework-agnostic media player — React and Vue 3 adapters over a framework-free core.',
      favicon: '/favicon.svg',
      editLink: {
        baseUrl: 'https://github.com/bignosecss/media-lab/edit/main/apps/docs/',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/bignosecss/media-lab' },
      ],
      customCss: ['./src/styles/global.css'],
      sidebar: [
        { label: 'Intro', link: '/' },
        { label: 'Getting started', link: '/getting-started' },
        { label: 'Architecture', link: '/architecture' },
        { label: 'Core API', link: '/core' },
        { label: 'React', link: '/react' },
        { label: 'Vue', link: '/vue' },
        { label: 'Components', link: '/components' },
        { label: 'API reference', link: '/api-reference' },
        { label: 'Accessibility', link: '/accessibility' },
        { label: 'Design system', link: '/design-system' },
        { label: 'Playground', link: '/playground' },
        { label: 'License', link: '/license' },
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
