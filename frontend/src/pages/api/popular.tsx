// pages/api/tags/popular.js

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const allowlist = [
  "load.skz.app",
  "localhost:3000",
  "frontend.skz.app",
  "https://frontend.skz.app",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const origin = req.headers.host as string; // Use type assertion to ensure origin is of type string
  console.log(origin);
  // Check if the domain is in the allowlist
  if (allowlist.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const response = await axios.get(
      "https://load.skz.app/public/tags/popular"
    );
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
