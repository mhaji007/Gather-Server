const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");

// Query building via then API as a Promises/A+

exports.getPosts = (req, res) => {
  const posts = Post.find()
  .populate("postedBy", "_id name")
    .select(" _id title body")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
};

// =================================================== //

// Query building via exec

// exports.getPosts = (req, res) => {
//   Post.find({}).select(" _id title body").exec((err, data) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Posts could not load",
//       });
//     }
//     res.json(data);
//   });
// };

// =================================================== //

exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  // Keep the original extension of files (png, jpg, etc.)
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    console.log("FORM FIELDS FILES", fields, files);

    // Create a new post
    let post = new Post(fields);
    // Hide user's password and salt from response
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    // Assign post to a user
    post.postedBy = req.profile;
    // Handle image if uploaded
    if (files.photo) {
      // readFileSync is used to make sure
      // the entire file/image data is received before trying to save in database

      // image in binary format
      post.photo.data = fs.readFileSync(files.photo.path);
      // image type (png, jpg, etc.)
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).jsoon({
          error: err,
        });
      }
      res.json(result);
    });
  });

  // =================================================== //

  // Creating post prior to adding
  // image upload functionality

  // const post = new Post(req.body);
  // console.log("Creating post: ", req.body)
  // post.save((err, result) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: err,
  //     });
  //   }
  //   res.status(200).json({
  //     post: result,
  //   });
  // });

  // post.save().then((result) => {
  //   res.status(200).json({
  //     post: result,
  //   });
  // });
  // =================================================== //
};

exports.postsByUser = (req, res) => {
  // postedBy references the user model
  // find posts posted by a particular user
  Post.find({postedBy: req.profile._id})
  // and retrieve id and name of that user
  // for those posts
  .populate("postedBy", "_id name")
  // sort the posts based on created field
  .sort("-created")
  .exec((err, posts) =>{
    if (err) {
      return res.status(400).json({
        error:err
      })
    }
    // Don't need to wrap the posts
    // here like below. We can directly
    // return posts
    // res.json({posts: posts});
    res.json(posts);
  })
}
