const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
//! set_posts
const start_ep = "0";
const end_ep = "5";
const url = "https://www.oremanga.net/solo-leveling/solo-leveling-";
const pages_slug = "solo-leveling";
const el_target = ".reader-area";
const el_src = `src`;
//! set_posts
























//! backend setup
const uploadUrl = "https://load.skz.app/posts/uploads/posts";
const createUrl = "https://load.skz.app/posts/create/post";
//! backend setup
const posts_slug = `${pages_slug}-ตอนที่-`;
const downloadDirectory = path.join(__dirname, `downloads-${pages_slug}`);

fs.mkdir(downloadDirectory, { recursive: true }, (err) => {
  if (err) {
    console.error("เกิดข้อผิดพลาดในการสร้างโฟลเดอร์ downloads:", err);
  } else {
    console.log("โฟลเดอร์ downloads ถูกสร้างขึ้นแล้ว");
  }
});

async function saveToEndpoint(ep, imageUrls) {
  try {
    const posts_detail = imageUrls.map((item) => ({
      url: item.url,
      image_no: item.image_no,
    }));

    const body = {
      posts_slug: `${posts_slug}${ep}`,
      pages_slug: pages_slug,
      posts_ep: ep,
      posts_detail: posts_detail,
    };

    const response = await axios.post(createUrl, body);
    return response.data;
  } catch (error) {
    console.error("Error saving to endpoint:", error);
    throw error;
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(300000);

  for (let episode = start_ep; episode <= end_ep; episode++) {
    const currentUrl = `${url}${episode}/`;

    await page.goto(currentUrl);

    try {
      await page.waitForSelector(`${el_target}`, { timeout: 300000 });
    } catch (error) {
      console.error(`Timeout waiting for selector at URL: ${currentUrl}`);
      continue;
    }

    const imageUrls = await page.$$eval(
      `${el_target} img`,
      (images, el_src) => {
        // return images.map((img) => img.getAttribute("data-lazy-src"));
        return images.map((img) => img.getAttribute(el_src));
      },
      el_src
    );

    const episodeDirectory = path.join(downloadDirectory, `ep${episode}`);
    if (!fs.existsSync(episodeDirectory)) {
      fs.mkdirSync(episodeDirectory);
    }

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "binary");
      const fileName = `${i + 1}.webp`;
      const filePath = path.join(episodeDirectory, fileName);
      fs.writeFileSync(filePath, buffer);
      console.log(`Downloaded ${fileName}`);
    }

    const files = fs.readdirSync(episodeDirectory);
    const formData = new FormData();

    // เรียงลำดับไฟล์โดยใช้ฟังก์ชันเปรียบเทียบที่กำหนดขึ้น
    files.sort((a, b) => {
      const regex = /(\d+)/; // รูปแบบที่ใช้ในการค้นหาเลข
      const aNumber = parseInt(a.match(regex)[0], 10); // แปลงเลขในชื่อไฟล์เป็นตัวเลขจำนวนเต็ม
      const bNumber = parseInt(b.match(regex)[0], 10);
      return aNumber - bNumber; // เปรียบเทียบตัวเลข
    });

    for (const file of files) {
      console.log(file);
      const fileData = fs.readFileSync(path.join(episodeDirectory, file));
      const blob = new Blob([fileData], { type: "image/webp" });
      formData.append("uploads_posts_images", blob, file);
    }

    const uploadResponse = await axios.post(uploadUrl, formData);
    console.log("Upload result:", uploadResponse.data);

    //! ลบไฟล์ที่โหลดมา
    // fs.rmdirSync(episodeDirectory, { recursive: true });

    const saveResponse = await saveToEndpoint(episode, uploadResponse.data);
    console.log("Save result:", saveResponse);
  }

  await browser.close();
  console.log("done");
})();
