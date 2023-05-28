import axios from "axios";
import { getWithExpiry } from "../lib/localstorage";
axios.defaults.baseURL = "http://localhost:7777";
axios.defaults.headers.common = {
  Authorization: `bearer ${getWithExpiry("access_token")}`,
};
export default axios;
