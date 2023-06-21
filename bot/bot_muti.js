const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const start_ep = 1;
  const end_ep = 3;
  const url =
    "https://rose-manga.com/player-who-returned-10000-years-later-%e0%b8%95%e0%b8%ad%e0%b8%99%e0%b8%97%e0%b8%b5%e0%b9%88-";

  // ตรวจสอบว่าโฟลเดอร์ images ยังไม่มีอยู่
  if (!fs.existsSync("images")) {
    // สร้างโฟลเดอร์ images
    fs.mkdirSync("images");
  }

  for (let episode = start_ep; episode <= end_ep; episode++) {
    const currentUrl = `${url}${episode}/`;

    await page.goto(currentUrl);

    try {
      await page.waitForSelector(".reader-area img", { timeout: 60000 });
    } catch (error) {
      console.error(`Timeout waiting for selector at URL: ${currentUrl}`);
      continue;
    }

    const imageUrls = await page.$$eval(".reader-area img", (images) => {
      return images.map((img) => img.src);
    });

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const imageExtension = path.extname(imageUrl);
      const imageFileName = `downloads/image_${i}${imageExtension}`;

      try {
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imageFileName, response.data);
        console.log(`Image ${i} downloaded!`);
      } catch (error) {
        console.error(`Error downloading image ${i}:`, error);
      }
    }
  }

  await browser.close();
  console.log("done");
})();
