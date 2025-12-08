import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export function swVersionPlugin(): Plugin {
  return {
    name: 'sw-version-plugin',
    buildStart() {
      const swPath = path.resolve(__dirname, 'public/sw.js');
      const timestamp = Math.floor(Date.now() / 1000).toString();

      let swContent = fs.readFileSync(swPath, 'utf-8');
      swContent = swContent.replace(
        /const BUILD_TIMESTAMP = '[^']*';/,
        `const BUILD_TIMESTAMP = '${timestamp}';`
      );

      fs.writeFileSync(swPath, swContent, 'utf-8');
    },
  };
}
