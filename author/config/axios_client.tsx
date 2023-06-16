import axios from "axios";

import config from "./config";
require("dotenv").config();
const Cookies = require("js-cookie");
const axiosInstance = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Access-Control-Allow-Origin": `${process.env.API_END_POINT}`,
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("access_token");
  console.log(`access_token` + accessToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
