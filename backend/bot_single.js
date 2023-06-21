const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(300000);

  await page.goto(
    "https://rose-manga.com/the-beginning-after-the-end-%e0%b8%95%e0%b8%ad%e0%b8%99%e0%b8%97%e0%b8%b5%e0%b9%88-175-5/"
  );

  try {
    await page.waitForSelector(".reader-area", { timeout: 300000 });
  } catch (error) {
    console.error("Timeout waiting for selector");
    await browser.close();
    return;
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
    const fileName = `image-${i + 1}.webp`;
    const filePath = path.join(__dirname, "downloads", fileName);
    fs.writeFileSync(filePath, buffer);
    console.log(`Downloaded ${fileName}`);
  }

  await browser.close();
})();
