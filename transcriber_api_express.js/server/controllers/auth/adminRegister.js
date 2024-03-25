const { User } = require("../../models");

const { userPool, AmazonCognitoIdentity } = require("../../utils");

const adminRegister = () => async (req, res, next) => {
  const { email, password, username, age, secret } = req.body;
  const ADMIN_SECRET = process.env.ADMIN_SECRET;

  if (secret != ADMIN_SECRET) {
    res
      .status(400)
      .send("Please input the correct secret value for admin user");
    return;
  }

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
        Value: "ADMIN",
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

module.exports = { adminRegister };
