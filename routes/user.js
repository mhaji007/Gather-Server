const express = require("express");
const router = express.Router();

// Import validators
const { userUpdateValidator } = require("../validators/auth");

const { runValidation } = require("../validators");

// Import auth middlewares
const { requireSignin } = require("../controllers/auth");

// Import controllers

const {
  userById,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
  userPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower
} = require("../controllers/user");


router.put("/user/follow", requireSignin, addFollowing, addFollower)
router.put("/user/follow", requireSignin, removeFollowing, removeFollower)

// Anyone may view all users
router.get("/users", allUsers);
// Only logged-in users may view (details) of a single user
router.get("/user/:userId", requireSignin, getUser);
router.put(
  "/user/:userId",
  requireSignin,
  // userUpdateValidator,
  // runValidation,
  updateUser
);

router.get("/user/photo/:userId", userPhoto)
router.delete("/user/:userId", requireSignin, deleteUser);

// Retrieves userId from url and
// finds user information based on the id
// and makes it available on req object
router.param("userId", userById);

// module.exports = {
//   getPosts
// }

module.exports = router;
