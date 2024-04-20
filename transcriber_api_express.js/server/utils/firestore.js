const fbAdmin = require("firebase-admin");

const serviceAcc = require("../../keyfile.json");
const firebase = require("firebase");

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceAcc),
});

firebase.initializeApp(serviceAcc);

//const db = fbAdmin.firestore();
//const settings = {timestampsInSnapshots: true};
//db.settings(settings);

const fbAuth = fbAdmin.auth();

module.exports = { fbAuth, firebase, fbAdmin };
