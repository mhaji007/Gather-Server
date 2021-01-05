const express = require("express");
const router = express.Router();

// Import validators
const { createPostValidator } = require("../validators/post");

const { runValidation } = require("../validators");


// Import controllers

const {getPosts, createPost } = require("../controllers/post");

router.get("/", getPosts)
router.post("/post", createPostValidator, runValidation, createPost);


// module.exports = {
//   getPosts
// }

module.exports = router;
