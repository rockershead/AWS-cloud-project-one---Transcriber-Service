const { uploadFile, getFiles3Url, listFiles } = require("../../utils");

const list = () => async (req, res, next) => {
  try {
    const decodedToken = res.locals.result;

    const { user_id } = decodedToken;

    const result = await listFiles(
      `${process.env.AWS_S3_RETRIEVE_PATH}/${user_id}/`,
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
    res.status(200).send(files);
  } catch (err) {
    res.status(500).send(
      JSON.stringify({
        message: "Error listing filenames",
        err,
      })
    );
  }
};

module.exports = { list };
