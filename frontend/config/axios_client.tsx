require("dotenv").config();
const axios = require("axios");
axios.defaults.baseURL = "http://localhost:7777";
export default axios;
    