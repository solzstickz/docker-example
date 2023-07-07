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
  }

  await browser.close();
})();
