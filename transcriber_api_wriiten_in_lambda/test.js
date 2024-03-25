const moment = require("moment");
const { uploadFile, getFiles3Url, listFiles } = require("./utils");
require("dotenv").config();
const fs = require("fs");

async function listUserFiles() {
  const user_uuid = "9dd2999b9ee24788ba9d1fbaf9e7d935";
  const result = await listFiles(
    `${process.env.AWS_S3_ROOT_PATH}/${user_uuid}/`,
    process.env.AWS_S3_BUCKET
  );
  const files = [];
  result.forEach((path) => {
    const obj = {};
    const fileName = path.Key.split("/")[2];
    const date = path.LastModified;
    const _path = path.Key;
    obj["fileName"] = fileName;
    obj["date"] = date;
    obj["path"] = _path;
    files.push(obj);
  });

  console.log(files);
}

//listUserFiles();

async function getFile() {
  const path =
    "transcripts/9dd2999b9ee24788ba9d1fbaf9e7d935/ustad_haniff_lecture_1.txt";
  const files3Url = await getFiles3Url(path, process.env.AWS_S3_BUCKET);

  console.log(files3Url);
}

//getFile();

async function uploadVoiceFile() {
  try {
    const user_uuid = "9dd2999b9ee24788ba9d1fbaf9e7d935";
    const fileName = "ustad_haniff_lecture_6.mp3";
    const res = await uploadFile(
      `${process.env.AWS_S3_ROOT_PATH}/${user_uuid}/${fileName}`,
      process.env.AWS_S3_BUCKET,
      fs.createReadStream("./ustad_haniff_lecture_7.mp3")
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}
uploadVoiceFile();
