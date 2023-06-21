(async () => {
  const puppeteer = require("puppeteer");
  const fs = require("fs");
  const path = require("path");
  const axios = require("axios");
  const start_ep = 1;
  const end_ep = 3;
  const url =
    "https://rose-manga.com/player-who-returned-10000-years-later-%e0%b8%95%e0%b8%ad%e0%b8%99%e0%b8%97%e0%b8%b5%e0%b9%88-";

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (let episode = start_ep; episode <= end_ep; episode++) {
    const currentUrl = `${url}${episode}/`;

    await page.goto(currentUrl);

    try {
      await page.waitForSelector(".reader-area", { timeout: 60000 });
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
      const fileName = `image-ep${episode}-${i + 1}${extension}`;
      const filePath = path.join(__dirname, "downloads", fileName);
      fs.writeFileSync(filePath, buffer);
      console.log(`Downloaded ${fileName}`);
    }
  }

  await browser.close();
  console.log("done");
})();
