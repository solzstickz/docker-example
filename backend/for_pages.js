const axios = require("axios");

let headersList = {
 "Accept": "*/*",
 "User-Agent": "Thunder Client (https://www.thunderclient.com)",
 "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiYjQ5NzVjNDRjMzMyNzE4YjVkNTMwY2QzMmMxZjQxNmFjMDIxYTc5OGE4NWMxNjMzNDFmYmEyYjY3ZGMwM2I5ZmQzMmRmMjFhZjMyM2VjZGNiYjZjYTFkNTg3YzNhNDVlNzJkNDY1YTkwMmQ5MGFjZmU5MzE3YjE5ZGZmZTc4ZGQiLCJpYXQiOjE2ODM5NjU0MzYsImV4cCI6MTc4Mzk2NTQzNX0.cwcwsUlcBqFUB_OS44-ojkc0Z14PvKbG2lDBe2ujik4",
 "Content-Type": "application/json" 
}

let pagesSlugBase = "Somthine_wrong_";

async function createPagesLoop() {
  for (let i = 1; i < 50; i++) {
    console.log(pagesSlugBase + i);
    let bodyContent = JSON.stringify({
      "pages_slug": pagesSlugBase + i,
      "pages_view": 0,
      "pages_status_showing": "จันทร์",
      "pages_last_ep": 1,
      "pages_en": "Somthine_wrong",
      "pages_th": "ซัมติง",
      "pages_star": "9",
      "pages_type": "Manhua",
      "pages_follow": 0,
      "pages_title": "Somthine_wrongSomthine_wrongSomthine_wrongSomthine_wrong",
      "pages_simple": "Somthine_wrong",
      "pages_thumbnail": "uploads_dev/Mercenary-Enrollment-206x300.webp",
      "pages_description": "Somthine_wrongSomthine_wrongSomthine_wrongSomthine_wrongSomthine_wrongSomthine_wrongSomthine_wrongSomthine_wrongSomthine_wrongSomthine_wrongSomthine_wrong",
      "pages_tags": [
        {
          "tags_id": 1
        },
        {
          "tags_id": 4
        },
        {
          "tags_id": 2
        }
      ]
    });

    let reqOptions = {
      url: "https://load.skz.app/pages/create/page",
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