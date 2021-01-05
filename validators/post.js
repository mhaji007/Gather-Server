const { check } = require("express-validator");

// Array of fields to be checked
exports.createPostValidator = [
  check("title")
    // Make sure it is not empty
    .not()
    .isEmpty()
    .withMessage("Title is required"),
  check("title")
    // Make sure it is not empty
    .isLength({ min: 4 })
    .withMessage("Title of minimum 4 characters is required"),
  check("vody")
    // Make sure it is not empty
    .not()
    .isEmpty()
    .withMessage("Body is required"),
  // Make sure it is not short
  check("body")
    .isLength({ min: 4 })
    .withMessage("Body of minimum 4 characters is required"),
];
