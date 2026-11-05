import { writeFileSync } from 'node:fs';

const siteUrl = (process.env.VITE_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

const pages = [
  { path: '/', priority: '1.0' },
  { path: '/AboutUs', priority: '0.5' },
  { path: '/ContactUs', priority: '0.5' },
];

const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ({ path, priority }) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /Admin/
Disallow: /Account
Disallow: /Login
Disallow: /Register
Disallow: /EmailVerification

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), sitemap);
writeFileSync(new URL('../public/robots.txt', import.meta.url), robots);
console.log(`sitemap.xml and robots.txt written for ${siteUrl}`);
