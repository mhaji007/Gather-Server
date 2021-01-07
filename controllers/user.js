// User profile CRUD controller methods and middlewares

const User = require("../models/user");

const _ = require("lodash");


// ================ auth middlewares ================ //

// Custom middleware for finding a single user
// based on route parmeters passed in url
// and making user info available on req.profile

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


// Alternative custom middleware for finding a single
// user and making user info availbale on req.profile

// Custom middleware to make logged-in user info available
// This middleware requires that requireSignin runs first
// so the ._id is available on req.user


exports.authMiddleWare = (req, res, next) => {
  const authUserId = req.user._id;
  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      console.log(err);
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
  if (!authorized) {
    return res.status(403).json({
      error: "You are not authorized to perform this action",
    });
  }
};

// ============================================================== //


// Controller for returning all users

exports.allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ users });
  }).select("name email update created");
};

// Controller for returning a single user

// user id is passed from client
// to server in the url, triggering
// userById to run and making user
// info available on req.profile
// Therefore we only need to return
// req.profile
exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// Controller for updating a single user
exports.updateUser = (req, res, next) => {
  let user = req.profile;
  // Extend- mutate first object (user)
  // with data in req.body (fields to be updated)
  user = _.extend(user, req.body);
  user.updated = Date.now();
  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: "You are not authorized to perform this action",
      });
    }
    // Hide user's password and salt from response
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({user})
  });
};


// Controller for deleting a single user
exports.deleteUser=(req, res, next) => {
  let user = req.profile;
  user.remove((err, user)=> {
    if(err) {
      return res.status(400).json({
        error:err
      })
    }

     res.json({ message: "User was deleted successfully"});

  })
}
