const express = require("express");
const router = express.Router();

// Import validators
const { userSignupValidator } = require("../validators/auth");

const { runValidation } = require("../validators");

// Import controllers

const { signup } = require("../controllers/auth");

router.post("/signup", userSignupValidator, runValidation, signup);

module.exports = router;
