const { uploadFile, getFiles3Url, listFiles } = require("../../utils");

const uploadVoiceFile = () => async (req, res, next) => {
  const { mimetype, originalname, buffer } = req.file;
  try {
    //const decodedToken = res.locals.result;
    const user_uuid = "9dd2999b9ee24788ba9d1fbaf9e7d935"; //for testing
    const path = `${process.env.AWS_S3_UPLOAD_PATH}/${user_uuid}/${originalname}`;

    const result = await uploadFile(path, process.env.AWS_S3_BUCKET, buffer);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { uploadVoiceFile };
