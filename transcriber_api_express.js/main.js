const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const api = require("./server/api");
//const MongoStore = require("connect-mongo"); ///for session store
require("dotenv").config();
//const {authorize}=require('./authentication.js')

const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", api());

/* Enforce https
app.use(function(req, res, next) {
    if(req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === "http") {
        res.redirect("https://" + req.headers.host + req.url);
    } else {
        next();
    }
});*/

module.exports = { app };
