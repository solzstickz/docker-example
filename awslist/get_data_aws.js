const aws = require("aws-sdk");
const spacesEndpoint = new aws.Endpoint("sgp1.digitaloceanspaces.com");
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "DO00FLU439PWPJEABC72",
  secretAccessKey: "CYHobUPR4PBxJT0wG2mpYwSjRfmaO5ny0s/u5RpcgSo",
});

const fs = require('fs');

const getObjectsFromSpace = async (bucketName) => {
  try {
    let objects = [];
    let continuationToken = null;

    do {
      const params = {
        Bucket: bucketName,
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      };

      const response = await s3.listObjectsV2(params).promise();
      objects = objects.concat(response.Contents);
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return objects;
  } catch (err) {
    console.log("Error", err);
    return null;
  }
};

const saveObjectsToFile = async (objects, fileName) => {
  try {
    const jsonData = JSON.stringify(objects);
    fs.writeFileSync(fileName, jsonData);
    console.log("Data written to", fileName);
  } catch (err) {
    console.log("Error", err);
  }
};

const bucketName = "container-uploads-storage";
const fileName = "data.json";

const fetchDataAndSaveToFile = async () => {
  const objects = await getObjectsFromSpace(bucketName);
  if (objects) {
    await saveObjectsToFile(objects, fileName);
    console.log("Total objects:", objects.length);
  } else {
    console.log("Failed to fetch objects from space.");
  }
};

fetchDataAndSaveToFile();
