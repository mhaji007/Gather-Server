const express = require("express");
const router = express.Router();

// Import validators
const { createPostValidator } = require("../validators/post");

const { runValidation } = require("../validators");

// Import auth middlewares
const {requireSignin } = require("../controllers/auth");

// Import controllers
const {
  getPosts,
  createPost,
  postsByUser,
  isPoster,
  updatePost,
  deletePost,
  postById,
} = require("../controllers/post");
const { userById } = require("../controllers/user");
router.get("/posts", getPosts)
// Post route prior sending form data (using formidable)

// router.post("/post", requireSignin, createPostValidator, runValidation, createPost);

// express-validator does not work with formidable form data.
// Validations before body parsing takes place. So when express-validator does its thing,
// it will see an empty req.body.

// So we can do client-side validation with React later
// so that empty title, body is not send to backend.
router.post("/post/new/:userId", requireSignin, createPost);



router.get("/posts/by/:userId", requireSignin, postsByUser);

router.put("/post/:postId", requireSignin, isPoster, updatePost);

// requireSign in makes sure the user is logged in
// isPoster makes sure the logged in user owns the post
// that is about to be updated
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

// Retrieves userId from url and
// finds user information based on the user id
// and makes it available on req object
router.param("userId", userById);

// Retrieves postId from url and
// finds post information based on the post id
// and makes it available on req object
router.param("postId", postById);

// module.exports = {
//   getPosts
// }

module.exports = router;
