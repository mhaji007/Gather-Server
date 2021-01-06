// User profile udpate controller methods and middlewares

const User = require("../models/user");

exports.userById = (req, res, next, id)=> {
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
  })
}
