// User profile udpate controller methods and middlewares

const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    // Make currently logged-in user's
    // information available on a new
    // property on req named profile
    req.profile = user;
    next();
  });
};

// Custom middleware for checking authorized user

// First check if userById() middleware worked successfully.
// If yes, then we will have the user available as req.profile

// if we have req.profile available then check req.auth's availablity
// (this will be made available if the token is valid by jwt package
// using requireSignin() middleware). If both are available then compare if
// req.profile._id === req.auth._id
// If true, that would mean that currently logged in user
// is same as the user who is in req.profile.

exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;
    if(!authorized) {
      return res.status(403).json({
        error: "You are not authorized to perform this action"
      })
    }
};

exports.allUsers= (req, res) => {
  User.find((err,users) => {
    if(err) {
      return res.status(400).json({
        error:err
      })
    }
    res.json({users})
  }).select("name email update created")
}
