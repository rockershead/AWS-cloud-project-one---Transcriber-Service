const { uploadFile, getFiles3Url, listFiles } = require("../../utils");

const show = () => async (req, res, next) => {
  //const decodedToken = res.locals.result;

  //const { user_id } = decodedToken;
  const user_id = "0013567"; //for testing
  try {
    const { path } = req.body; //s3 path   //path format is transcripts/user_id/filename.txt
    checkUserId = path.split("/")[1] == user_id;

    if (checkUserId) {
      const files3Url = await getFiles3Url(path, process.env.S3_BUCKET);

      res.status(200).send(files3Url);
    } else {
      res.status(400).send("Not authorized to get this file");
    }
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
