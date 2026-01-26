import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'https://clutchzone-backend.onrender.com/api';
const SITE_URL = 'https://clutchzone.co';

const STATIC_ROUTES = [
  '/',
  '/cars',
  '/properties',
  '/about',
  '/login'
];

async function generateSitemap() {
  try {
    console.log('Fetching cars...');
    const carsRes = await axios.get(`${API_BASE_URL}/cars`);
    const cars = carsRes.data || [];

    console.log('Fetching properties...');
    const propsRes = await axios.get(`${API_BASE_URL}/properties`);
    const properties = propsRes.data || [];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Static Routes
    STATIC_ROUTES.forEach(route => {
      sitemap += `
  <url>
    <loc>${SITE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    // Cars
    cars.forEach(car => {
      let imagesXml = '';
      if (car.images && car.images.length > 0) {
        car.images.forEach(img => {
          imagesXml += `
    <image:image>
      <image:loc>${img}</image:loc>
      <image:title>${car.title || car.brand || 'Car'}</image:title>
    </image:image>`;
        });
      }
      
      sitemap += `
  <url>
    <loc>${SITE_URL}/cars/${car.slug || car._id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${imagesXml}
  </url>`;
    });

    // Properties
    properties.forEach(prop => {
      let imagesXml = '';
      if (prop.images && prop.images.length > 0) {
        prop.images.forEach(img => {
          imagesXml += `
    <image:image>
      <image:loc>${img}</image:loc>
      <image:title>${prop.title || 'Property'}</image:title>
    </image:image>`;
        });
      }

      sitemap += `
  <url>
    <loc>${SITE_URL}/properties/${prop.slug || prop._id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${imagesXml}
  </url>`;
    });

    sitemap += `
</urlset>`;

    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log(`✅ Sitemap generated with ${STATIC_ROUTES.length} static pages, ${cars.length} cars, and ${properties.length} properties.`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

generateSitemap();
