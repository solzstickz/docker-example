const fs = require("fs");
const moment = require("moment");

const readDataFile = () => {
  try {
    const jsonData = fs.readFileSync("unique_files.json", "utf-8");
    const data = JSON.parse(jsonData);
    let keyname = [];
  for (i in data) {
    let Key = data[i].Key;
    keyname.push({ Key: Key });
  }
    console.log("Number of rows:", data.length);
    fs.writeFileSync('dataRemove.json', JSON.stringify(keyname));
  } catch (err) {
    console.log("Error", err);
  }
};

readDataFile();