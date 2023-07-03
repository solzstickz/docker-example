const fs = require("fs");
const moment = require("moment");

const readDataFile = () => {
  try {
    const jsonData = fs.readFileSync("unique_files.json", "utf-8");
    const data = JSON.parse(jsonData);
    const formatdatetime = "YYYY-MM-DD HH:mm:ss";
  for (i in data) {
    const data_date = moment(data[i].LastModified).tz('Asia/Bangkok').format(formatdatetime);
    console.log(data_date);
  }
    console.log("Number of rows:", data.length);
  } catch (err) {
    console.log("Error", err);
  }
};

readDataFile();