const { validateJwt } = require("../utils");

const permissionHandler = async (req, res, next) => {
  if (req.headers.authorization != undefined) {
    const jwt = req.headers.authorization.replace("Bearer ", "");
    const result = await validateJwt(jwt);
    if (result != "Invalid Token") {
      res.locals.result = result;
      next();
    } else {
      res.status(500).send("Invalid Token");
    }
  } else {
    res.status(500).send({ message: "No authorization field" });
  }
};

module.exports = { permissionHandler };
