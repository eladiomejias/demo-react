import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/<repository-name>/',
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
});