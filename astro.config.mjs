// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';


import icon from 'astro-icon';


// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare({
    platformProxy: {
      enabled: false
    }
  }),

  integrations: [icon()],
});