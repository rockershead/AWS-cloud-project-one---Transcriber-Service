const { userPool, AmazonCognitoIdentity } = require("../../utils");
const {
  CognitoUserSession,
  CognitoIdToken,
  CognitoAccessToken,
  CognitoRefreshToken,
} = require("amazon-cognito-identity-js");

const logout = () => async (req, res, next) => {
  const { email, idToken, accessToken, refreshToken } = req.body;

  var userData = {
    Username: email,
    Pool: userPool,
  };
  const id_token = new CognitoIdToken({
    IdToken: idToken,
  });

  const access_token = new CognitoAccessToken({
    AccessToken: accessToken,
  });

  const refresh_token = new CognitoRefreshToken({
    RefreshToken: refreshToken,
  });
  const tokens = {
    IdToken: id_token,
    RefreshToken: refresh_token,
    AccessToken: access_token,
  };

  let session = new CognitoUserSession(tokens);
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.signInUserSession = session;

  if (!session.isValid()) {
    let sessionErr = new Error("Invalid Session!");
    console.log(sessionErr);
  }

  //const result = await cognitoUser.signOut();
  cognitoUser.globalSignOut({
    onSuccess: (result) => {
      console.log("Logout successful:", result);
      res.status(200).send(result);
    },
    onFailure: (err) => {
      console.error("Logout error:", err);
      res.status(400).send("Logout Error");
    },
    async: true,
  });
};

module.exports = { logout };
