const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const start_ep = 6;
const end_ep = 10;
const url =
  "https://rose-manga.com/revenge-of-the-iron-blooded-sword-hound-%E0%B8%95%E0%B8%AD%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // เพิ่มเวลาการนำทางเป็น 60 วินาที (60000 มิลลิวินาที)
  // 360000 มิลลิวินาที = 6 นาที
  // 5 นาที = 300000 มิลลิวินาที
  page.setDefaultNavigationTimeout(300000);

  for (let episode = start_ep; episode <= end_ep; episode++) {
    const currentUrl = `${url}${episode}/`;

    await page.goto(currentUrl);

    try {
      await page.waitForSelector(".reader-area", { timeout: 300000 });
    } catch (error) {
      console.error(`Timeout waiting for selector at URL: ${currentUrl}`);
      continue;
    }

    const imageUrls = await page.$$eval(".reader-area img", (images) => {
      return images.map((img) => img.src);
    });

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "binary");
      const extension = path.extname(imageUrl);
      const fileName = `image-ep${episode}-${i + 1}.webp`;
      const filePath = path.join(__dirname, "downloads", fileName);
      fs.writeFileSync(filePath, buffer);
      console.log(`Downloaded ${fileName}`);
    }
  }

  await browser.close();
  console.log("done");
})();
