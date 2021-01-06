const express = require("express");
const router = express.Router();

// Import validators
const { createPostValidator } = require("../validators/post");

const { runValidation } = require("../validators");

// Import auth middlewares
const {requireSignin } = require("../controllers/auth");

// Import controllers

const {getPosts, createPost } = require("../controllers/post");
const { userById } = require("../controllers/user");

router.get("/posts", getPosts)
router.post("/post", requireSignin, createPostValidator, runValidation, createPost);

// Retrieves userId from url and
// finds user information based on the id
// and makes it available on req object
router.param("userId", userById);


// module.exports = {
//   getPosts
// }

module.exports = router;
