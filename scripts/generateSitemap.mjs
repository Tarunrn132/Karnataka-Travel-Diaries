/**
 * Karnataka Travel Diaries - Production Sitemap Generator
 * 
 * Generates standards-compliant sitemap.xml for Google Search Console and web crawlers.
 * Automatically indexes all canonical public travel guides, destination pages, and core public routes.
 * Excludes private user dashboards, authentication, and API endpoints.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables if present
try {
  process.loadEnvFile();
} catch (e) {}

const isProd = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';
let BASE_URL = (
  process.env.PRODUCTION_URL ||
  (isProd ? process.env.NEXT_PUBLIC_APP_URL : null) ||
  process.env.FRONTEND_URL ||
  (!isProd && process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL : 'https://YOUR-PRODUCTION-DOMAIN.com')
).replace(/\/$/, '');

if (isProd && BASE_URL.includes('localhost')) {
  BASE_URL = (process.env.PRODUCTION_DOMAIN || 'https://YOUR-PRODUCTION-DOMAIN.com').replace(/\/$/, '');
}

const { karnatakaDestinations } = require('../js/data.js');

const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/explore.html', priority: '0.9', changefreq: 'weekly' },
  { url: '/map.html', priority: '0.8', changefreq: 'monthly' }
];

const destinationRoutes = (karnatakaDestinations || []).map(dest => ({
  url: `/destination.html?id=${dest.slug}`,
  priority: '0.9',
  changefreq: 'weekly',
  lastmod: today
}));

const allUrls = [...staticRoutes, ...destinationRoutes];

const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

for (const entry of allUrls) {
  xmlLines.push('  <url>');
  xmlLines.push(`    <loc>${BASE_URL}${entry.url}</loc>`);
  xmlLines.push(`    <lastmod>${entry.lastmod || today}</lastmod>`);
  xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  xmlLines.push(`    <priority>${entry.priority}</priority>`);
  xmlLines.push('  </url>');
}

xmlLines.push('</urlset>');
const xmlOutput = xmlLines.join('\n');

// Write to root directory
const rootSitemapPath = path.join(rootDir, 'sitemap.xml');
fs.writeFileSync(rootSitemapPath, xmlOutput, 'utf8');
console.log(`✅ Generated root sitemap: ${rootSitemapPath} (${allUrls.length} public URLs)`);

// Also write to public/ directory if it exists
const publicDir = path.join(rootDir, 'public');
if (fs.existsSync(publicDir)) {
  const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xmlOutput, 'utf8');
  console.log(`✅ Generated public sitemap: ${publicSitemapPath}`);
}
