import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import cron from "node-cron";
import dayjs from "../../../lib/dayjsUtils";

const MAX_URLS = 1000;
const SITEMAP_PATH = "./public/sitemap.xml";
const SITEMAP_TAGS_PATH = "./public/sitemap_tags.xml";
const SITEMAP_PAGES_PATH = "./public/sitemap_series.xml";
const SITEMAP_POSTS_PATH = "./public/sitemap-posts";
require("dotenv").config();
const base_url = process.env.SITE_URL;
const base_url_api = process.env.API_URL;

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

function updateSitemap(urls: string[], filePath: string) {
  const sitemapXml = createSitemapXml(urls);
  fs.writeFileSync(filePath, sitemapXml);
}

function updateMainSitemap(urls: string[], count: number) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  xml += `
    <url>
      <loc>${base_url}sitemap_series.xml</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${base_url}sitemap_tags.xml</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `;
  for (let i = 1; i <= count; i++) {
    xml += `
      <url>
        <loc>${base_url}sitemap-posts-${i}.xml</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  }
  xml += `
    </urlset>
  `;
  fs.writeFileSync(SITEMAP_PATH, xml);
}

export default async function sitemapXml(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pagesResponse = await axios.get(
      `${base_url_api}public/sitemap/pages/slug`
    );
    const pagesSlug = pagesResponse.data;

    const pages = pagesSlug.map(
      (slug: any) => `${base_url}series/${slug.pages_slug}`
    );

    const tagsResponse = await axios.get(
      `${base_url_api}public/sitemap/tags/slug`
    );
    const tagsSlug = tagsResponse.data;

    const tags = tagsSlug.map(
      (slug: any) => `${base_url}tags/${slug.tags_slug}`
    );

    const urls = [...pages, ...tags];

    updateSitemap(tags, SITEMAP_TAGS_PATH);
    updateSitemap(pages, SITEMAP_PAGES_PATH);

    const postsResponse = await axios.get(
      `${base_url_api}public/sitemap/posts/slug`
    );
    const postsSlug = postsResponse.data;

    const posts = postsSlug.map((slug: any) => `${base_url}${slug.posts_slug}`);

    let sitemapPostsXml: string[] = [];
    let count = 0;
    let sitemap_posts = 1;
    for (const postUrl of posts) {
      if (count % MAX_URLS === 0) {
        if (sitemapPostsXml.length > 0) {
          const filePath = `${SITEMAP_POSTS_PATH}-${Math.floor(
            count / MAX_URLS
          )}.xml`;
          fs.writeFileSync(filePath, createSitemapXml(sitemapPostsXml));
        }
        sitemapPostsXml = [];
      }

      sitemapPostsXml.push(postUrl);
      count++;
      sitemap_posts = Math.floor(count / MAX_URLS);
    }

    // Write the last batch of URLs to a sitemap file
    if (sitemapPostsXml.length > 0) {
      const filePath = `${SITEMAP_POSTS_PATH}-${Math.floor(
        count / MAX_URLS
      )}.xml`;
      fs.writeFileSync(filePath, createSitemapXml(sitemapPostsXml));
    }

    updateMainSitemap(urls, sitemap_posts);

    console.log(
      `Sitemaps Build successfully ✅  ${dayjs().format("DD/MM/YYYY HH:mm:ss")}`
    );
    res.json({
      message: `Update Sitemap Successfully ✅ at ${dayjs().format(
        "DD/MM/YYYY HH:mm:ss"
      )}`,
    });
  } catch (error) {
    console.error("Failed to update sitemaps:", error);
    res.status(500).json({ error: "Failed to update sitemaps" });
  }
}

// Create a cron job that calls the updateSitemap function every hour
cron.schedule("0 * * * *", async () => {
  try {
    const pagesResponse = await axios.get(
      `${base_url_api}public/sitemap/pages/slug`
    );
    const pagesSlug = pagesResponse.data;

    const pages = pagesSlug.map(
      (slug: any) => `${base_url}series/${slug.pages_slug}`
    );

    const tagsResponse = await axios.get(
      `${base_url_api}public/sitemap/tags/slug`
    );
    const tagsSlug = tagsResponse.data;

    const tags = tagsSlug.map(
      (slug: any) => `${base_url}tags/${slug.tags_slug}`
    );

    const urls = [...pages, ...tags];

    const postsResponse = await axios.get(
      `${base_url_api}public/sitemap/posts/slug`
    );
    const postsSlug = postsResponse.data;

    const posts = postsSlug.map((slug: any) => `${base_url}${slug.posts_slug}`);

    let sitemapPostsXml: string[] = [];
    let count = 0;
    let sitemap_posts = 1;
    for (const postUrl of posts) {
      if (count % MAX_URLS === 0) {
        if (sitemapPostsXml.length > 0) {
          const filePath = `${SITEMAP_POSTS_PATH}-${Math.floor(
            count / MAX_URLS
          )}.xml`;
          fs.writeFileSync(filePath, createSitemapXml(sitemapPostsXml));
        }
        sitemapPostsXml = [];
      }

      sitemapPostsXml.push(postUrl);
      count++;
      sitemap_posts = Math.floor(count / MAX_URLS);
    }

    // Write the last batch of URLs to a sitemap file
    if (sitemapPostsXml.length > 0) {
      const filePath = `${SITEMAP_POSTS_PATH}-${Math.floor(
        count / MAX_URLS
      )}.xml`;
      fs.writeFileSync(filePath, createSitemapXml(sitemapPostsXml));
    }

    updateMainSitemap(urls, sitemap_posts);
    updateSitemap(tags, SITEMAP_TAGS_PATH);
    updateSitemap(pages, SITEMAP_PAGES_PATH);

    console.log(
      `Sitemaps updated CronJob successfully ✅ at ${dayjs().format(
        "DD/MM/YYYY HH:mm:ss"
      )}
        `
    );
  } catch (error) {
    console.error("Failed to update sitemaps:", error);
  }
});
