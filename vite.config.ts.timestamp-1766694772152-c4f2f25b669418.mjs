// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js";

// vite-plugin-sw-version.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
var __vite_injected_original_dirname = "/home/project";
function swVersionPlugin() {
  const hashFilePath = path.resolve(__vite_injected_original_dirname, ".sw-hash");
  return {
    name: "sw-version-plugin",
    buildStart() {
      const swPath = path.resolve(__vite_injected_original_dirname, "public/sw.js");
      const swContent = fs.readFileSync(swPath, "utf-8");
      const contentWithoutTimestamp = swContent.replace(
        /const BUILD_TIMESTAMP = '[^']*';/,
        ""
      );
      const currentHash = crypto.createHash("md5").update(contentWithoutTimestamp).digest("hex");
      let previousHash = "";
      if (fs.existsSync(hashFilePath)) {
        previousHash = fs.readFileSync(hashFilePath, "utf-8");
      }
      if (currentHash !== previousHash) {
        const timestamp = Math.floor(Date.now() / 1e3).toString();
        const newContent = swContent.replace(
          /const BUILD_TIMESTAMP = '[^']*';/,
          `const BUILD_TIMESTAMP = '${timestamp}';`
        );
        fs.writeFileSync(swPath, newContent, "utf-8");
        fs.writeFileSync(hashFilePath, currentHash, "utf-8");
      }
    }
  };
}

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    swVersionPlugin(),
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: null,
      injectManifest: {
        injectionPoint: void 0
      },
      strategies: "injectManifest",
      srcDir: "public",
      filename: "sw.js",
      manifest: {
        name: "Comelo - Tu Asistente de Nutrici\xF3n",
        short_name: "Comelo",
        description: "Crea listas de compras y descubre recetas saludables",
        theme_color: "#FF6B6B",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        lang: "es",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: "module"
      }
    })
  ],
  server: {
    port: 5173
  },
  build: {
    outDir: "dist",
    sourcemap: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1wbHVnaW4tc3ctdmVyc2lvbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3Byb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcHJvamVjdC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xuaW1wb3J0IHsgc3dWZXJzaW9uUGx1Z2luIH0gZnJvbSAnLi92aXRlLXBsdWdpbi1zdy12ZXJzaW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHN3VmVyc2lvblBsdWdpbigpLFxuICAgIHJlYWN0KCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdwcm9tcHQnLFxuICAgICAgaW5qZWN0UmVnaXN0ZXI6IG51bGwsXG4gICAgICBpbmplY3RNYW5pZmVzdDoge1xuICAgICAgICBpbmplY3Rpb25Qb2ludDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIHN0cmF0ZWdpZXM6ICdpbmplY3RNYW5pZmVzdCcsXG4gICAgICBzcmNEaXI6ICdwdWJsaWMnLFxuICAgICAgZmlsZW5hbWU6ICdzdy5qcycsXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiAnQ29tZWxvIC0gVHUgQXNpc3RlbnRlIGRlIE51dHJpY2lcdTAwRjNuJyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ0NvbWVsbycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQ3JlYSBsaXN0YXMgZGUgY29tcHJhcyB5IGRlc2N1YnJlIHJlY2V0YXMgc2FsdWRhYmxlcycsXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnI0ZGNkI2QicsXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxuICAgICAgICBvcmllbnRhdGlvbjogJ3BvcnRyYWl0LXByaW1hcnknLFxuICAgICAgICBsYW5nOiAnZXMnLFxuICAgICAgICBzdGFydF91cmw6ICcvJyxcbiAgICAgICAgc2NvcGU6ICcvJyxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvaWNvbnMvaWNvbi0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2ljb25zL2ljb24tNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgcHVycG9zZTogJ2FueSBtYXNrYWJsZSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBkZXZPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdtb2R1bGUnLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3Byb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Byb2plY3Qvdml0ZS1wbHVnaW4tc3ctdmVyc2lvbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9wcm9qZWN0L3ZpdGUtcGx1Z2luLXN3LXZlcnNpb24udHNcIjtpbXBvcnQgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcblxuZXhwb3J0IGZ1bmN0aW9uIHN3VmVyc2lvblBsdWdpbigpOiBQbHVnaW4ge1xuICBjb25zdCBoYXNoRmlsZVBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLnN3LWhhc2gnKTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdzdy12ZXJzaW9uLXBsdWdpbicsXG4gICAgYnVpbGRTdGFydCgpIHtcbiAgICAgIGNvbnN0IHN3UGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMvc3cuanMnKTtcbiAgICAgIGNvbnN0IHN3Q29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhzd1BhdGgsICd1dGYtOCcpO1xuXG4gICAgICBjb25zdCBjb250ZW50V2l0aG91dFRpbWVzdGFtcCA9IHN3Q29udGVudC5yZXBsYWNlKFxuICAgICAgICAvY29uc3QgQlVJTERfVElNRVNUQU1QID0gJ1teJ10qJzsvLFxuICAgICAgICAnJ1xuICAgICAgKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRIYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShjb250ZW50V2l0aG91dFRpbWVzdGFtcCkuZGlnZXN0KCdoZXgnKTtcblxuICAgICAgbGV0IHByZXZpb3VzSGFzaCA9ICcnO1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoaGFzaEZpbGVQYXRoKSkge1xuICAgICAgICBwcmV2aW91c0hhc2ggPSBmcy5yZWFkRmlsZVN5bmMoaGFzaEZpbGVQYXRoLCAndXRmLTgnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnRIYXNoICE9PSBwcmV2aW91c0hhc2gpIHtcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3QgbmV3Q29udGVudCA9IHN3Q29udGVudC5yZXBsYWNlKFxuICAgICAgICAgIC9jb25zdCBCVUlMRF9USU1FU1RBTVAgPSAnW14nXSonOy8sXG4gICAgICAgICAgYGNvbnN0IEJVSUxEX1RJTUVTVEFNUCA9ICcke3RpbWVzdGFtcH0nO2BcbiAgICAgICAgKTtcblxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHN3UGF0aCwgbmV3Q29udGVudCwgJ3V0Zi04Jyk7XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoaGFzaEZpbGVQYXRoLCBjdXJyZW50SGFzaCwgJ3V0Zi04Jyk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTs7O0FDRHhCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUNqQixPQUFPLFlBQVk7QUFIbkIsSUFBTSxtQ0FBbUM7QUFLbEMsU0FBUyxrQkFBMEI7QUFDeEMsUUFBTSxlQUFlLEtBQUssUUFBUSxrQ0FBVyxVQUFVO0FBRXZELFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFDWCxZQUFNLFNBQVMsS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFDckQsWUFBTSxZQUFZLEdBQUcsYUFBYSxRQUFRLE9BQU87QUFFakQsWUFBTSwwQkFBMEIsVUFBVTtBQUFBLFFBQ3hDO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFDQSxZQUFNLGNBQWMsT0FBTyxXQUFXLEtBQUssRUFBRSxPQUFPLHVCQUF1QixFQUFFLE9BQU8sS0FBSztBQUV6RixVQUFJLGVBQWU7QUFDbkIsVUFBSSxHQUFHLFdBQVcsWUFBWSxHQUFHO0FBQy9CLHVCQUFlLEdBQUcsYUFBYSxjQUFjLE9BQU87QUFBQSxNQUN0RDtBQUVBLFVBQUksZ0JBQWdCLGNBQWM7QUFDaEMsY0FBTSxZQUFZLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxHQUFJLEVBQUUsU0FBUztBQUN6RCxjQUFNLGFBQWEsVUFBVTtBQUFBLFVBQzNCO0FBQUEsVUFDQSw0QkFBNEIsU0FBUztBQUFBLFFBQ3ZDO0FBRUEsV0FBRyxjQUFjLFFBQVEsWUFBWSxPQUFPO0FBQzVDLFdBQUcsY0FBYyxjQUFjLGFBQWEsT0FBTztBQUFBLE1BQ3JEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjs7O0FEaENBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLGdCQUFnQjtBQUFBLElBQ2hCLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLGdCQUFnQjtBQUFBLE1BQ2hCLGdCQUFnQjtBQUFBLFFBQ2QsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxNQUNBLFlBQVk7QUFBQSxNQUNaLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLGtCQUFrQjtBQUFBLFFBQ2xCLFNBQVM7QUFBQSxRQUNULGFBQWE7QUFBQSxRQUNiLE1BQU07QUFBQSxRQUNOLFdBQVc7QUFBQSxRQUNYLE9BQU87QUFBQSxRQUNQLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDWDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNYO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNWLFNBQVM7QUFBQSxRQUNULE1BQU07QUFBQSxNQUNSO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxFQUNiO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
