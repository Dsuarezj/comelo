import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
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
        theme_color: '#01EF41',
        background_color: '#01EF41',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'es',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon.png',
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
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
