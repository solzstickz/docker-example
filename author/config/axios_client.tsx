import axios from "axios";

const axios_client = axios.create({
  baseURL: `http://localhost:7777`,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios_client;
