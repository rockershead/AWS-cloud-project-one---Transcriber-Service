const { uploadFile, getFiles3Url, listFiles } = require("../../utils");

const show = () => async (req, res, next) => {
  try {
    const { path } = req.body; //s3 path

    const files3Url = await getFiles3Url(path, process.env.AWS_S3_BUCKET);

    res.status(200).send(files3Url);
  } catch (err) {
    res.status(500).send(
      JSON.stringify({
        message: "Error getting s3Url",
        err,
      })
    );
  }
};

module.exports = { show };
