const fs = require('fs');

const compareAndStoreUniqueFiles = (file1, file2, outputFileName) => {
  console.time('Execution Time'); // เริ่มต้นการนับเวลา

  const data1 = JSON.parse(fs.readFileSync(file1));
  const data2 = JSON.parse(fs.readFileSync(file2));

  const uniqueFiles = [];

  for (const obj1 of data1) {
    let isUnique = true;
    for (const obj2 of data2) {
      if (obj1.Key === obj2.url) {
        isUnique = false;
        break;
      }
    }
    if (isUnique) {
      uniqueFiles.push(obj1);
    }
  }

  fs.writeFileSync(outputFileName, JSON.stringify(uniqueFiles));
  console.log("Unique files written to", outputFileName);

  console.timeEnd('Execution Time'); // สิ้นสุดการนับเวลา
};

const file1 = 'data.json';
const file2 = 'mysql.json';
const outputFileName = 'unique_files.json';

compareAndStoreUniqueFiles(file1, file2, outputFileName);