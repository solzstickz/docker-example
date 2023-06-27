const axios = require("axios");
const config = require("./config");
require('dotenv').config();
axios.defaults.baseURL = process.env.API_URL;
export default axios;
