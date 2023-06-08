const moment = require('moment-timezone');
const formatdatetime = "YYYY-MM-DD HH:mm:ss"
console.log(moment().tz('Asia/Bangkok').format(formatdatetime));