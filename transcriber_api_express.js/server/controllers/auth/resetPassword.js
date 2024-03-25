const { User } = require("../../models");
const {
  poolData,
  poolRegion,
  userPool,
  AmazonCognitoIdentity,
} = require("../../utils");

const resetPassword = () => async (req, res, next) => {
  const { email } = req.body; //in this case is email

  var userData = {
    Username: email,
    Pool: userPool,
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.forgotPassword({
    onSuccess: function (result) {
      res.status(200).send(result);
    },

    onFailure: function (err) {
      res.status(400).send(err);
    },
  });
};

const confirmPassword = () => async (req, res, next) => {
  const { code, email, newPassword } = req.body;

  var userData = {
    Username: email,
    Pool: userPool,
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.confirmPassword(code, newPassword, {
    onSuccess: function (result) {
      res.status(200).send(result);
    },

    onFailure: function (err) {
      res.status(400).send(err);
    },
  });
};

module.exports = { resetPassword, confirmPassword };
