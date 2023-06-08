require("dotenv").config();
const axios = require("axios");
axios.defaults.baseURL = "http://localhost:5000";
export default axios;
