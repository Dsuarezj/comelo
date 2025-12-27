import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://comelo.vercel.app';
const PRIVATE_ROUTES = ['/onboarding', '*'];
const PRIORITY_MAP = {
  '/': 1.0,
  '/recipes': 0.9,
  '/shopping-lists': 0.9,
  '/create-list': 0.8,
  '/search-recipes': 0.8,
  '/plan-week': 0.8,
};

function extractRoutes(appPath) {
  const content = readFileSync(appPath, 'utf-8');
  const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
  const routes = [];
  let match;

  while ((match = routeRegex.exec(content)) !== null) {
    const path = match[1];
    if (!PRIVATE_ROUTES.includes(path) && !path.includes(':')) {
      routes.push(path);
    }
  }

  return [...new Set(routes)];
}

function generateSitemap(routes) {
  const sortedRoutes = routes.sort((a, b) => {
    const priorityA = PRIORITY_MAP[a] || 0.7;
    const priorityB = PRIORITY_MAP[b] || 0.7;
    return priorityB - priorityA;
  });

  const urls = sortedRoutes.map((route) => {
    const priority = PRIORITY_MAP[route] || 0.7;
    const lastmod = new Date().toISOString().split('T')[0];
    
    return `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function main() {
  const appPath = join(process.cwd(), 'src', 'App.tsx');
  const outputPath = join(process.cwd(), 'public', 'sitemap.xml');

  try {
    const routes = extractRoutes(appPath);
    const sitemap = generateSitemap(routes);
    writeFileSync(outputPath, sitemap, 'utf-8');
    console.log(`✅ Sitemap generado con ${routes.length} rutas:`, routes.join(', '));
  } catch (error) {
    console.error('❌ Error generando sitemap:', error);
    process.exit(1);
  }
}

main();

