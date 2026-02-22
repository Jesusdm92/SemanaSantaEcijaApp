import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../public/data/hermandades-2025.json');
const PUBLIC_DIR = path.join(__dirname, '../public');
const SITEMAP_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');
const BASE_URL = 'https://semanasantaecija.app';

// Static routes
const routes = [
    '',
    '/hermandades',
    '/agenda',
    '/hoy-sale',
    '/acerca-de'
];

async function generateSitemap() {
    console.log('Generating sitemap.xml...');

    // Read hermandades data
    let hermandades = [];
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        hermandades = JSON.parse(data);
        console.log(`Found ${hermandades.length} hermandades.`);
    } catch (err) {
        console.error('Error reading hermandades data:', err.message);
        process.exit(1);
    }

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static routes
    for (const route of routes) {
        xml += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    }

    // Add dynamic hermandad routes
    for (const h of hermandades) {
        xml += `
  <url>
    <loc>${BASE_URL}/hermandades/${h.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    xml += `
</urlset>`;

    // Write file
    fs.writeFileSync(SITEMAP_FILE, xml);
    console.log(`Sitemap generated at ${SITEMAP_FILE}`);
}

generateSitemap();
