const { User } = require("../../models");

const prompt = require("prompt");
const { userPool, AmazonCognitoIdentity, validateJwt } = require("../../utils");

const login = () => async (req, res, next) => {
  const { email, password } = req.body;

  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });

  var userData = {
    Username: email,
    Pool: userPool,
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: async function (result) {
      //means confirmed so can update status confirmation

      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(500).send("User does not exist");
      }

      if (user.confirmationStatus == false) {
        user.confirmationStatus = true;
        user.save();
      }

      const decodedToken = await validateJwt(result.getIdToken().getJwtToken());
      const role = decodedToken["custom:role"];

      const returnObject = {
        accessToken: result.getAccessToken().getJwtToken(),
        idToken: result.getIdToken().getJwtToken(),
        refreshToken: result.getRefreshToken().getToken(),
        role: role,
      };

      res.status(200).send(returnObject);
    },

    mfaRequired: function (codeDeliveryDetails) {
      prompt.get(["verificationCode"], function (err, result) {
        if (err) {
          return err;
        }
        console.log("Command-line input received:");
        console.log(
          "Please input verification code: " + result.verificationCode
        );
        cognitoUser.sendMFACode(result.verificationCode, {
          onSuccess: function (result) {
            const returnObject = {
              accessToken: result.getAccessToken().getJwtToken(),
              idToken: result.getIdToken().getJwtToken(),
              refreshToken: result.getRefreshToken().getToken(),
            };
            res.status(200).send(returnObject);
          },
          onFailure: function (err) {
            res.status(400).send(err);
          },
        });
      });
    },
    onFailure: function (err) {
      res.status(400).send(err);
    },
  });
};

module.exports = { login };
