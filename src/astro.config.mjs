import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  srcDir: '.',
  outDir: './dist',
  publicDir: '../public',
  output: 'static',
  site: 'https://mohammadaminkafi.github.io',
  base: '/cessa-vault',
  build: {
    assets: 'assets'
  }
});
