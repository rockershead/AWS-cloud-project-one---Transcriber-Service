const { User } = require("../../models");

const { userPool, AmazonCognitoIdentity } = require("../../utils");
const { SUBSCRIPTION_TIER } = require("../../../library/Constants");

const register = () => async (req, res, next) => {
  const { email, password, username, age } = req.body;

  var user = await User.findOne({ email: email });

  if (user) {
    res.status(400).send("This user already exists.");
  } else {
    const user = new User({
      email: email,
      confirmationStatus: false,
      username: username,

      age: age,
    });

    await user.save();

    var attributeList = [];
    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "custom:username",
        Value: username,
      })
    );

    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "email",
        Value: email,
      })
    );

    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "custom:role",
        Value: "MEMBER",
      })
    );
    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "custom:subscriptionTier",
        Value: SUBSCRIPTION_TIER.FREE,
      })
    );

    //attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"updated_at",Value:updated_at}));
    //attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:role",Value:role.toString()}));

    userPool.signUp(
      email,
      password,
      attributeList,
      null,
      function (err, result) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        const cognitoUser = result.user;
        //console.log("user is " + JSON.stringify(cognitoUser);
        res.status(200).send(cognitoUser);
      }
    );
  }
};

module.exports = { register };
