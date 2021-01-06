const express = require("express");
const router = express.Router();

// Import validators
const { userSignupValidator } = require("../validators/auth");

const { runValidation } = require("../validators");

// Import controllers

const { signup, signin } = require("../controllers/auth");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", signin);

module.exports = router;
