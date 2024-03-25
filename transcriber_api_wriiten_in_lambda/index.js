const moment = require("moment");
const { uploadFile, getFiles3Url, listFiles } = require("./utils");
const parser = require("lambda-multipart-parser");

//upload a voice file   POST /transcripts
module.exports.uploadVoiceFile = async (event) => {
  try {
    const result = await parser.parse(event);
    console.log(result.files);
    const { contentType, filename, content } = result.files[0];
    const user_uuid = "9dd2999b9ee24788ba9d1fbaf9e7d935"; //for testing.must get from authorization token
    await uploadFile(
      `${process.env.AWS_S3_ROOT_PATH}/${user_uuid}/${filename}`,
      process.env.AWS_S3_BUCKET,
      content
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          "File uploaded successfully.Please wait while the transcript is being generated",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error uploading file",
        err,
      }),
    };
  }
};

//for a particular user list out his/her transcripts  GET /transcripts/

module.exports.listTranscripts = async (event) => {
  //use authorization token to get uuid of user

  try {
    const user_uuid = "9dd2999b9ee24788ba9d1fbaf9e7d935"; //for testing
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
    return {
      statusCode: 200,
      body: JSON.stringify(files),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error listing filenames",
        err,
      }),
    };
  }
};

//retrieve a transcript based on its id or name     POST /transcripts/download
module.exports.getTranscript = async (event) => {
  try {
    const { path } = JSON.parse(event.body);

    const files3Url = await getFiles3Url(path, process.env.AWS_S3_BUCKET);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: files3Url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error getting s3Url",
        err,
      }),
    };
  }
};
