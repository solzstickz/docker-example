import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// นำเข้าภาษาที่ต้องการใช้
import "dayjs/locale/th";
dayjs.locale("th");

var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

export default dayjs;
