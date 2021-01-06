const express = require("express");
const router = express.Router();



// Import controllers

const {signup } = require("../controllers/auth");

router.post("/signup", signup);


module.exports = router;
