import { defineConfig } from 'vite';

const ghPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  base: ghPages ? '/dictater/' : '/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        teacher: 'teacher.html'
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js']
  }
});
