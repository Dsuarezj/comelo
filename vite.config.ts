import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { swVersionPlugin } from './vite-plugin-sw-version';

export default defineConfig({
  plugins: [
    swVersionPlugin(),
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      injectManifest: {
        injectionPoint: undefined,
      },
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      manifest: {
        name: 'Comelo - Tu Asistente de Nutrición',
        short_name: 'Comelo',
        description: 'Crea listas de compras y descubre recetas saludables',
        theme_color: '#FF6B6B',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'es',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
