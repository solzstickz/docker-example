// frontend/src/pages/api/search/[search].tsx
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const allowlist = [
  "load.9tailmanga.com",
  "localhost:3000",
  "9tailmanga.com",
  "https://9tailmanga.com",
];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // ตรวจสอบว่าโดเมนของผู้ใช้อยู่ใน allowlist
  const origin = req.headers.host as string; // Use type assertion to ensure origin is of type string
  // Check if the domain is in the allowlist
  if (allowlist.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "POST") {
    // ดำเนินการเมื่อมีการร้องขอ GET
    // ทำงานเมื่อมีการค้นหา
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: "Missing search parameter" });
    }

    try {
      // ดึงข้อมูลจาก https://load.9tailmanga.com/public/search/${search}
      const fetch_search = await axios.get(
        `https://load.9tailmanga.com/public/search/${search}`
      );
      const searchResult = fetch_search.data;

      res.status(200).json(searchResult);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // ดำเนินการเมื่อมีการร้องขออื่นๆ
    res.status(405).json({ message: "Not Allowed" });
  }
};

export default handler;
