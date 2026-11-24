import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kurmagram.pages.dev',
  compressHTML: true,
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  vite: { preview: { strictPort: true } },
});
