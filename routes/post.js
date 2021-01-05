const express = require("express");
const router = express.Router();


// Import controllers

const {getPosts} = require("../controllers/post");

router.get("/", getPosts)


// module.exports = {
//   getPosts
// }

module.exports = router;
