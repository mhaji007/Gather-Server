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
  res
    .status(200)
    .json({
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
    if (!user.authentiate(password)) {
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
    // and we want to make sure we receive cookie from server
    // and do not want to use token stored client-side (e.g., in local storage)
    res.cookie("t", token, { expire: new Date() + 9999 });

    // Return response with user and token to frontend client
    const { _id, name, email } = user;

    return res.json({ token, user: { _id, email, name } });
  });
};
