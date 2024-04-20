const express = require("express");

const { errorHandler, permissionHandler } = require("../middleware");

// List all controllers here

const transcripts = require("../controllers/transcripts");

const routersInit = (config) => {
  const router = express();

  router.use(permissionHandler);
  router.use("/transcripts", transcripts());

  // Define API Endpoints
  //router.use("/users", users());

  // Catch all API Errors
  router.use(errorHandler);
  return router;
};

module.exports = routersInit;
