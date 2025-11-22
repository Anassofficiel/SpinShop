import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',
    allowedHosts: true, // خليه يسمح بأي هوست فـ dev
  },

  plugins: [react(), mode === 'development' && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      {
        find: '@components',
        replacement: path.resolve(__dirname, './src/components'),
      },
      {
        find: '@ui',
        replacement: path.resolve(__dirname, './src/components/UI'),
      },
      {
        find: /^@\/components\/ui/,
        replacement: path.resolve(__dirname, './src/components/UI'),
      },
      {
        find: /^@components\/ui/,
        replacement: path.resolve(__dirname, './src/components/UI'),
      },
    ],
  },
}));
