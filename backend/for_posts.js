const axios = require("axios");

let headersList = {
 "Accept": "*/*",
 "User-Agent": "Thunder Client (https://www.thunderclient.com)",
 "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiYjQ5NzVjNDRjMzMyNzE4YjVkNTMwY2QzMmMxZjQxNmFjMDIxYTc5OGE4NWMxNjMzNDFmYmEyYjY3ZGMwM2I5ZmQzMmRmMjFhZjMyM2VjZGNiYjZjYTFkNTg3YzNhNDVlNzJkNDY1YTkwMmQ5MGFjZmU5MzE3YjE5ZGZmZTc4ZGQiLCJpYXQiOjE2ODM5NjU0MzYsImV4cCI6MTc4Mzk2NTQzNX0.cwcwsUlcBqFUB_OS44-ojkc0Z14PvKbG2lDBe2ujik4",
 "Content-Type": "application/json" 
}

let pagesSlugBase = "Somthine_wrong_";
let posts_slug = "Somthine_1";

async function createPagesLoop() {
  for (let i = 1; i < 50; i++) {
    console.log(pagesSlugBase + i);
    let bodyContent = JSON.stringify({
        "posts_slug": posts_slug + i,
        "pages_slug": pagesSlugBase + i,
        "posts_ep": 1,
        "posts_detail": [
            {
                "url": "uploads_dev/Mercenary-Enrollment-206x300.webp",
                "image_no": 1
            },
            {
                "url": "uploads_dev/Mercenary-Enrollment-206x300.webp",
                "image_no": 2
            }
        ]
    });

    let reqOptions = {
      url: "https://load.skz.app/posts/create/post",
      method: "POST",
      headers: headersList,
      data: bodyContent,
    }

    let response = await axios.request(reqOptions);
    console.log(response.data);
  }
}

// เรียกใช้งานฟังก์ชันเพื่อเริ่มวนลูป
createPagesLoop();