<<<<<<< HEAD
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  for (let episode = 1084; episode <= 1086; episode++) {
    const url = `https://9tailmanga.com/one-piece-%E0%B8%95%E0%B8%AD%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-${episode}`;

    await page.goto(url);

    try {
      await page.waitForTimeout(5000);
      await page.waitForSelector(".reading img");
    } catch (err) {
      console.log("Not found page" + episode);
      await browser.close();
    }

    // ทำสิ่งที่คุณต้องการทดสอบในแต่ละตอน

    // รอให้หน้าเว็บโหลดเสร็จ

    //เช็ค timeout ว่ามีหรือไม่
    await page.waitForTimeout(100); // รอ 5 วินาทีก่อนที่จะไปยังตอนถัดไป
=======
const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://9tailmanga.com/return-of-the-mount-hua-sect-%E0%B8%95%E0%B8%AD%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-';
const className = '.reading';
const start = 100;
const end = 10000;
const slug = 'return-of-the-mount-hua-sect';
const logFolder = 'logs_found_pages';
const logFilePath = `${logFolder}/${slug}.txt`;

// ตรวจสอบและลบไฟล์ log หากมีอยู่
if (fs.existsSync(logFilePath)) {
  fs.unlinkSync(logFilePath);
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (let episode = start; episode <= end; episode++) {
    const episodeUrl = url + episode;

    await page.goto(episodeUrl, { waitUntil: 'networkidle0' });

    const hasClass = await page.evaluate((className) => {
      return !document.querySelector(className);
    }, className);

    if (hasClass) {
      const logMessage = `No "${slug}" class found for episode ${episode}`;
      if (!fs.existsSync(logFolder)) {
        fs.mkdirSync(logFolder);
      }

      fs.appendFileSync(logFilePath, `${logMessage}\n`);

      console.log(logMessage);

      continue;
    }

    console.log("found");

    await page.waitForTimeout(5000);
>>>>>>> origin/dev
  }

  await browser.close();
})();
