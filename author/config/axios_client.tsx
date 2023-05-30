import axios from "axios";
import { getWithExpiry } from "../lib/localstorage";
import config from "./config";
axios.defaults.baseURL = config.API_URL;
axios.defaults.headers.common = {
  Authorization: `bearer ${getWithExpiry("access_token")}`,
};
export default axios;
