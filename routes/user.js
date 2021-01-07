const express = require("express");
const router = express.Router();

// Import auth middlewares
const {requireSignin } = require("../controllers/auth");


// Import controllers

const { userById, allUsers, getUser, updateUser  } = require("../controllers/user");

// Anyone may view all users
router.get("/users", allUsers);
// Only logged-in users may view (details) of a single user
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, updateUser);


// Retrieves userId from url and
// finds user information based on the id
// and makes it available on req object
router.param("userId", userById);

// module.exports = {
//   getPosts
// }

module.exports = router;
