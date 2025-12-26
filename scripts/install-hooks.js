import { readFileSync, writeFileSync, chmodSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const hooksDir = join(projectRoot, '.git', 'hooks');
const sourceHook = join(projectRoot, 'scripts', 'hooks', 'pre-push');
const targetHook = join(hooksDir, 'pre-push');

if (!existsSync(join(projectRoot, '.git'))) {
  console.error('❌ Not a git repository. Please run this from the project root.');
  process.exit(1);
}

if (!existsSync(hooksDir)) {
  mkdirSync(hooksDir, { recursive: true });
}

try {
  const hookContent = readFileSync(sourceHook, 'utf8');
  writeFileSync(targetHook, hookContent);
  chmodSync(targetHook, '755');

  console.log('✅ Git pre-push hook installed successfully!');
  console.log('📝 The hook will run tests automatically when pushing to main branch.');
} catch (error) {
  console.error('❌ Failed to install git hook:', error.message);
  process.exit(1);
}
