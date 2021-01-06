const express = require("express");
const router = express.Router();

// Import validators
const { createPostValidator } = require("../validators/post");

const { runValidation } = require("../validators");

// Import auth middlewares
const {requireSignin } = require("../controllers/auth");

// Import controllers

const {getPosts, createPost } = require("../controllers/post");

router.get("/post", requireSignin, getPosts)
router.post("/post", createPostValidator, runValidation, createPost);


// module.exports = {
//   getPosts
// }

module.exports = router;
