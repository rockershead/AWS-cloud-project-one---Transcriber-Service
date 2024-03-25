const { Router: router } = require("express");
const { uploadVoiceFile } = require("./uploadVoiceFile");
const { list } = require("./list");
const { show } = require("./show");
const multer = require("multer");
const upload = multer({
  limits: { files: 1 },
});

module.exports = () => {
  const api = router();

  api.post("/", show());
  api.post("/uploadVoiceFile", upload.single("video"), uploadVoiceFile());
  api.get("/", list());

  return api;
};
