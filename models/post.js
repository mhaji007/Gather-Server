const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title is required",
    minlength: [4, "Title cannot be less than 4 characters"],
    maxlength: [150, "Title cannot exceed 150 characters"],
  },
  body: {
    type: String,
    required: "Body is required",
    minlength: [4, "Body cannot be less than 4 characters"],
    maxlength: [2000, "Body cannot exceed 150 characters"],
  },
});

module.exports = mongoose.model("Post", postSchema);
