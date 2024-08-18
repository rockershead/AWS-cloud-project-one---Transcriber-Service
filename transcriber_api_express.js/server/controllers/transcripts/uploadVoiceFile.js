const { uploadFile, getFiles3Url, listFiles } = require("../../utils");

const uploadVoiceFile = () => async (req, res, next) => {
  const { mimetype, originalname, buffer } = req.file;
  //const decodedToken = res.locals.result;

  //const { user_id } = decodedToken;
  const user_id = "0013567"; //for testing
  try {
    const path = `${process.env.S3_UPLOAD_PATH}/${user_id}-${originalname}`;

    const result = await uploadFile(path, process.env.S3_BUCKET, buffer);
    res
      .status(200)
      .send(
        "File Uploaded Successfully.Please wait while we transcribe your file"
      );
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { uploadVoiceFile };
