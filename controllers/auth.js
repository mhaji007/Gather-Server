// Core auth specific controller methods and middlewares

const User = require("../models/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

// Query building via async await

// Check if user already exists in database
exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    // 403 ==> Forbidden client (like 401 but reauthentication won't make a difference)
    return res.status(403).json({
      error:
        "The email address you entered is associated with another Gather account. Please sign in or use another email address to create a new account",
    });
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({
    message: "You have successfully singed up. Please proceed to log in.",
  });
};

// Query building via exec

// Check if user already exists in database
// exports.singup = (req, res) => {
//   const {email} = req.body;

//    User.findOne({ email }).exec((err, user) => {
//         if (user) {
//           // 401 ==> Unauthorized (reauthentiation possible)
//           return res.status(401).json({
//             error: "Email is taken. Please choose another email.",
//           });
//         }
//         // Create new user
//         const newUser = new User({
//           username,
//           name,
//           email,
//           password,
//           categories,
//         });
//         newUser.save((err, result) => {
//           if (err) {
//             console.log(err);
//             return res.status(401).json({
//               error: "Error saving user in database. Please try again later.",
//             });
//           }
//           return res.json({
//             message: "Registration was successful. Please proceed to login.",
//           });
//         });
//       });

//     }

exports.signin = (req, res) => {
  // Find user based on email

  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    // If error is found or no user is found
    if (err || !user) {
      return res.status(401).json({
        error: "No user associated with this email found in the database",
      });
    }

    // If user found, authenticate user and make sure email and password match
    // (i.e., after retrieving the user via their email,
    // check their submitted password against hashed password in the database
    // via authenticate method in user model )
    // If this step is skipped, anyone can
    // log in to anyone's account
    if (!user.authenticate(password)) {
      // If authenticate returns false,
      // alert user that email and password do not match
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    // Generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
      //  ,
      //  {
      //    expiresIn: "10m",
      //  }
    );

    // Send cookie back both in res.cookie and res.json
    // Persist the token as 't' in cookie with expiry date
    // This is useful when for example server-side rendering is used
    // and we want to make sure we receive token from server
    // and do not want to use and rely on token stored client-side (e.g., in local storage)
    res.cookie("t", token, { expire: new Date() + 9999 });

    // Return response with user and token to frontend client
    const { _id, name, email } = user;

    return res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Successfully signed out" });
};

// ================ Auth middleware ================ //

// expressJWT middleware to check for valid token and
// also make id of user available to any role-based auth middlewares

// requireSignin looks for valid token in the request headers
// (i.e., checks for Bearer token, which is a combination of
// secret key and _id, in headers and if it is there,
// it will decode and compare the secret with our secret stored in .env
// if that match and if token is not expired, then the token is valid)
// In other words, if a token is found, it will check the token
// against the secret and if the same secret
// is used on signing the token, then it will check
// for expiry of the token and if that checks out
// it will make the decoded token (what was used in generating the json web token)
// available on req.user (e.g., here _id is used
// in genearating the token, hence req.user._id)
exports.requireSignin = expressJwt({
  // Accessing a protected route requires secret from client
  // but we only have access to this secret when we are signed in
  // and are in possession of token

  // If token is valid, express-jwt  appends the
  // verified user id in an auth key to the request object
  // Note: alternatively user id can be obtained
  // after running requireSignin via req.user._id.
  // express-jwt will verify the JWT using JWT_SECRET from .env and the expiry date.

  // If token is valid, then the data
  // (used to create token during signin such as user._id ) is made available as req.user by default.
  // but userProperty: 'auth' ( custom configuration option ) is used here
  // So instead of req.user it makes req.auth available to access.
  // Therefore any routes that uses requireSignin, that route's controller method will have access to req.auth.

  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});
