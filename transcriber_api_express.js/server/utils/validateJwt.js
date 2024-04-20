const { fbAuth } = require("./firestore");

async function validateJwt(jwtToken) {
  try {
    const decodedToken = await fbAuth.verifyIdToken(jwtToken);
    return decodedToken;
  } catch {
    return "Invalid Token";
  }
}

module.exports = { validateJwt };
