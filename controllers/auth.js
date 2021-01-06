// Auth specific controller methods and middlewares

const User = require("../models/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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
    res.status(200).json({message: "You have successfully singed up. Please proceed to log in."})
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

  // If error is found or no user is found

  // If user found, authenticate user

  // Generate a token with user id and secret

  // Persist the token as 't' in cookie with expiry date

  // Return response with user and token to frontend client

}
