require("dotenv").config();
const axios = require("axios");
axios.defaults.baseURL = "http://load.skz.app/";
export default axios;
