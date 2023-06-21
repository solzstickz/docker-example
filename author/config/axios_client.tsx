import axios from "axios";

import config from "./config";
const Cookies = require("js-cookie");
const axiosInstance = axios.create({
  baseURL: config.API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
