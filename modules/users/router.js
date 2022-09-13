const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserByUserName,
  createUser,
  updateUser,
  deleteUser,
} = require("./controller");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  await getAllUsers()
    .then((user) => {
      let respuesta = {
        success: true,
        data: user,
      };
      res.status(200).json(respuesta);
    })
    .catch((user) => res.status(500).json(user));
});

/* GET user by username*/
router.get("/:username", async function (req, res, next) {
  let username = req.params.username;
  await getUserByUserName(username)
    .then((user) => {
      if (user !== null) {
        let respuesta = {
          success: true,
          data: user,
        };
        res.status(200).json(respuesta);
      } else {
        let error = {
          success: false,
          statusCode: 404,
          msg: "The user with the given username was not found.",
        };
        res.status(404).json(error);
      }
    })
    .catch((err) => res.status(500).end());
});

/** Update user by username*/
router.put("/:username", async function (req, res, next) {
  let username = req.params.username;
  await updateUser(username, req.body)
    .then((user) => {
      if (user !== null) {
        let respuesta = {
          success: true,
          data: user,
        };
        res.status(200).json(respuesta);
      } else {
        let error = {
          success: false,
          statusCode: 404,
          msg: "The user with the given username was not found.",
        };
        res.status(404).json(error);
      }
    })
    .catch((err) => res.status(500).end());
});

/* DELETE user by username */
router.delete("/:username", async function (req, res, next) {
  let username = req.params.username;
  await deleteUser(username)
    .then((user) => {
      if (user !== null) {
        let respuesta = {
          success: true,
        };
        res.status(204).json(respuesta);
      } else {
        let error = {
          success: false,
          statusCode: 404,
          msg: "The user with the given username was not found.",
        };
        res.status(404).json(error);
      }
    })
    .catch((err) => res.status(500).end());
});

module.exports = router;
