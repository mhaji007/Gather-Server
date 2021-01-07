const express = require("express");
const router = express.Router();

// Import validators
const { userSignupValidator } = require("../validators/auth");

const { runValidation } = require("../validators");

// Import controllers

const { signup, signin, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// Look for the paramater in the incoming
// request of the url
// for any route containing userId
// first execute userbyId
// Retrieves userId from url and
// finds user information based on the id
// and makes it available on req object
router.param("userId", userById);

module.exports = router;
