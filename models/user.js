const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now(),
  },
  updated: Date,
  photo: {
    // Space allocated by node.js
    // for storing photo until it is fully received
    // from client
    data: Buffer,
    // The file format
    contentType: String,
  },
  about: {
    type: String,
    trim: true,
  },
});

// Virtual fields ==> "password", used to get the plain password
// and save the hashed password. It has a middleware role
// virtual fields are additional fields for a given model.
// Their values can be set manually or automatically with defined functionality.
// Virtual properties don't get presisted in the database
// They only exist logically and are not written to document's collection

// password from client side
// is passed to virtual

// virtual field takes and return
// the plain password. The plain password
// is hashed and saved in the database in the process
userSchema
  .virtual("password")
  .set(function (password) {
    // create temp varaible called _password
    this._password = password;

    // generate salt (timestamp)
    // using custom function
    // this.salt refers to salt in schema
    // this.salt = this.makeSalt();

    // generate salt (timestamp)
    // using uuid package
    this.salt = uuidv4();
    // encrypt password
    // this.hashed_password is hassed-password in schema
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Methods ==>
// each user schema may be assigned methods
// 1) authenticate compares and checks the incoming password
// and the hashed version
// 2) encryptPassword  which will hash the password upon
//  user registeration and subsequent login attempts
// 3) makeSalt
// export user schema

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  // makeSalt: function () {
  //   return Math.round(new Date().valueOf() * Math.random()) + "";
  // },
};

module.exports = mongoose.model("User", userSchema);
