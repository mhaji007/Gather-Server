const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");

// Query building via then API as a Promises/A+

exports.getPosts = (req, res) => {
  const posts = Post.find()
    .select(" _id title body")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
};

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


exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  // Keep the original extension of files
  form.keepExtensions = true;

  form.parse((req, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    let post = new Post(fields);
    // Add user to the new post
    post.postesdBy = req.profile;
    // Handle image
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
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
};
