const express = require("express");
const router = express.Router();



// Import controllers

const { userById, allUsers } = require("../controllers/user");

router.get("/users", allUsers);


// Retrieves userId from url and
// finds user information based on the id
// and makes it available on req object
router.param("userId", userById);

// module.exports = {
//   getPosts
// }

module.exports = router;
