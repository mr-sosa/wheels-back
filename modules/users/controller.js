const { getDbRef } = require("../../lib/mongo");
let jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { ObjectID, ObjectId, Double, Int32 } = require("mongodb");
const jwtKey = process.env.JSON_TOKEN;
const COLLECTION_NAME = "users";

async function createUser(user) {
  try {
    const { username, password, email } = user;
    if ((await getUserByUserName(username)) || (await getUserByEmail(email))) {
      return {
        success: false,
        msg: "User is already registered",
      };
    }

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    user.verifiedEmail = false;
    user.verifiedPhone = false;
    user.photo = "";
    user.about = "";
    user.isDriver = false;
    user.score = Double(0.0);
    user.phone = parseInt(user.phone);
    user.unionDate = new Date();
    user.birthDate = new Date(user.birthDate);

    console.log(user.unionDate);
    await getDbRef().collection(COLLECTION_NAME).insertOne(user);
    const token = jwt.sign({ username, email }, jwtKey);
    return {
      success: true,
      msg: "User was successfully registered",
      data: {
        username,
        email,
      },
      token,
    };
  } catch (error) {
    console.error("Error CreateUser: ", error);
    return {
      success: false,
      msg: "Internal error",
    };
  }
}

const getAllUsers = async () => {
  try {
    const users = await getDbRef()
      .collection(COLLECTION_NAME)
      .find({})
      .toArray();
    return { users };
  } catch (error) {
    console.error("Error GetAllUsers: ", error);
    return { error };
  }
};

async function getUserByUserName(username) {
  try {
    const user = await getDbRef()
      .collection(COLLECTION_NAME)
      .findOne({ username });
    return user;
  } catch (error) {
    console.error("Error GetUserByUserName: ", error);
    return { error };
  }
}

async function getUserByEmail(email) {
  try {
    const user = await getDbRef()
      .collection(COLLECTION_NAME)
      .findOne({ email });
    return user;
  } catch (error) {
    console.error("Error GetUserByEmail: ", error);
    return { error };
  }
}

async function updateUser(username_, user) {
  try {
    user.score = Double(0.0);
    user.phone = parseInt(user.phone);
    user.birthDate = new Date(user.birthDate);

    let user = await getDbRef()
      .collection(COLLECTION_NAME)
      .updateOne({ username: username_ }, { $set: user });
    user = await getUserByUserName(username_);
    return { user };
  } catch (error) {
    console.error("Error UpdateUser: ", error);
    return { error };
  }
}

async function deleteUser(username) {
  try {
    const user = await getDbRef()
      .collection(COLLECTION_NAME)
      .deleteOne({ username });
    return { user };
  } catch (error) {
    console.error("Error DeleteUser: ", error);
    return { error };
  }
}

module.exports = {
  getAllUsers,
  getUserByUserName,
  createUser,
  updateUser,
  deleteUser,
};
