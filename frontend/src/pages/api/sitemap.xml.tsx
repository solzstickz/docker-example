import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import cron from "node-cron";

const MAX_URLS = 10;
const SITEMAP_PATH = "./public/sitemap.xml";

function createSitemapXml(urls: string[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const url of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  return xml;
}

async function updateSitemap(urls: string[]) {
  const totalUrls = urls.length;
  const sitemapXml = createSitemapXml(urls);

  fs.writeFileSync(SITEMAP_PATH, sitemapXml);

  console.log("Sitemap updated successfully");
}

export default async function sitemapXml(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pagesResponse = await axios.get(
      "http://localhost:7777/public/sitemap/pages/slug"
    );
    const pagesSlug = pagesResponse.data;

    const pages = pagesSlug.map(
      (slug: any) => `https://front.skz.app/series/${slug.pages_slug}`
    );

    const tagsResponse = await axios.get(
      "http://localhost:7777/public/sitemap/tags/slug"
    );
    const tagsSlug = tagsResponse.data;

    const tags = tagsSlug.map(
      (slug: any) => `https://front.skz.app/tags/${slug.tags_slug}`
    );

    const urls = [...pages, ...tags];

    updateSitemap(urls);
  } catch (error) {
    console.error("Failed to update sitemap:", error);
  }
}

// สร้าง cron job ที่จะเรียกใช้งานฟังก์ชัน updateSitemap ทุกๆ 1 ชั่วโมง
cron.schedule("0 * * * *", async () => {
  try {
    const pagesResponse = await axios.get(
      "http://localhost:7777/public/sitemap/pages/slug"
    );
    const pagesSlug = pagesResponse.data;

    const pages = pagesSlug.map(
      (slug: any) => `https://front.skz.app/series/${slug.pages_slug}`
    );

    const tagsResponse = await axios.get(
      "http://localhost:7777/public/sitemap/tags/slug"
    );
    const tagsSlug = tagsResponse.data;

    const tags = tagsSlug.map(
      (slug: any) => `https://front.skz.app/tags/${slug.tags_slug}`
    );

    const urls = [...pages, ...tags];

    updateSitemap(urls);
  } catch (error) {
    console.error("Failed to update sitemap:", error);
  }
});
