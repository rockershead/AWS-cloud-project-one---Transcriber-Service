const { Router: router } = require("express");

const { register } = require("./register");

const { login } = require("./login");
const { resetPassword, confirmPassword } = require("./resetPassword");
const { logout } = require("./logout");
const { adminRegister } = require("./adminRegister");

module.exports = () => {
  const api = router();

  api.post("/register", register());
  api.post("/adminRegister", adminRegister());

  api.post("/login", login());
  api.post("/resetPassword", resetPassword());
  api.post("/confirmResetPassword", confirmPassword());
  api.post("/logout", logout());

  return api;
};
