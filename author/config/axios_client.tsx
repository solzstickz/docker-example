import axios from "axios";
import { getWithExpiry } from "../lib/localstorage";
import config from "./config";

const axiosInstance = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Access-Control-Allow-Origin": "https://author.skz.app",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getWithExpiry("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
