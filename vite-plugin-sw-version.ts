import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export function swVersionPlugin(): Plugin {
  const hashFilePath = path.resolve(__dirname, '.sw-hash');

  return {
    name: 'sw-version-plugin',
    buildStart() {
      const swPath = path.resolve(__dirname, 'public/sw.js');
      const swContent = fs.readFileSync(swPath, 'utf-8');

      const contentWithoutTimestamp = swContent.replace(
        /const BUILD_TIMESTAMP = '[^']*';/,
        ''
      );
      const currentHash = crypto.createHash('md5').update(contentWithoutTimestamp).digest('hex');

      let previousHash = '';
      if (fs.existsSync(hashFilePath)) {
        previousHash = fs.readFileSync(hashFilePath, 'utf-8');
      }

      if (currentHash !== previousHash) {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const newContent = swContent.replace(
          /const BUILD_TIMESTAMP = '[^']*';/,
          `const BUILD_TIMESTAMP = '${timestamp}';`
        );

        fs.writeFileSync(swPath, newContent, 'utf-8');
        fs.writeFileSync(hashFilePath, currentHash, 'utf-8');
      }
    },
  };
}
