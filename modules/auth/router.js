const express = require("express");
const router = express.Router();
const { createUser } = require("../users/controller");
var { login } = require("./controller");

/**
 * Login
 */
router.post("/login", async function (req, res, next) {
  console.log(req.body);
  const response = await login(req.body);
  if (response.success) {
    res.cookie("token", response.token, { httpOnly: true });
    res.status(200).send(response);
  } else {
    res.status(401).send(response);
  }
});

/*register*/
router.post("/register", async function (req, res, next) {
  try {
    const result = await createUser(req.body);
    if (result.success) {
      res.cookie("token", result.token, { httpOnly: true });
      res.status(201).send(result);
    } else {
      res.status(401).send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
