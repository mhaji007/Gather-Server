const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");

const _ = require("lodash");

// ================ auth middlewares ================ //

// Custom middleware for finding a single post
// based on route parmeters passed in url
// and making post info available on req.post

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    // Comment content and creation date of the post
    .populate("comments", "text created")
    // Poster of comment
    .populate("comments.postedBy", "_id name")
    .select("_id title body created likes comments photo")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        });
      }
      // Make post
      // information available on a new
      // property on req named profile
      req.post = post;
      next();
    });
};

// Custom middleware for checking authorized poster user

// First check if postById() middleware worked successfully.
// If yes, then we will have the post available as req.post

// if we have req.post available then check req.auth's availablity
// (this will be made available if the token is valid by jwt package
// using requireSignin() middleware). If both are available then compare if
// req.post.postedBy._id === req.auth._id
// If true, that would mean that this post belongs
// to the currently logged-in user and therefore they are
// authorized to perform an action on the route this middleware
// is applied to (e.g., they can delete the post).
exports.isPoster = (req, res, next) => {
  // "==" is used here since req.post.postedBy._id is of type number and
  // req.auth._id is of type string
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  console.log("req.post ===>", req.post);
  console.log("req.auth ===>", req.auth);
  console.log("req.post.postedBy ===>", req.post.postedBy);
  console.log("req.post.postedBy._id ===>", req.post.postedBy._id);
  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

// =================================================== //

// Query building via then API as a Promises/A+

exports.getPosts = (req, res) => {
  const posts = Post.find()
    // Poster of the post
    .populate("postedBy", "_id name")
    // Comment content and creation date of the post
    .populate("comments", "text created")
    // Poster of comment
    .populate("comments.postedBy", "_id name")
    .select(" _id title body created likes")
    .sort({ created: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => console.log(err));
}

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

// Controller for creating a single post
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

// Controller for returing all posts by a given user
exports.postsByUser = (req, res) => {
  // postedBy references the user model
  // find posts posted by a particular user
  Post.find({ postedBy: req.profile._id })
    // and retrieve id and name of that user
    // for those posts
    .populate("postedBy", "_id name")

    .select(" _id title body created likes")
    // sort the posts based on created field
    .sort("-created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      // Don't need to wrap the posts
      // here like below. We can directly
      // return posts
      // res.json({posts: posts});
      res.json(posts);
    });
};

// Controller for deleting a single post
exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: "Could not delete the post",
      });
    }
    res.json({
      message: "Post was deleted susccessfully",
    });
  });
};

// Controller for updating a single post (prior to handling
// post photo - formData
//)

// exports.updatePost = (req, res, next) => {
//   let post = req.post;
//   // Extend- mutate first object (post)
//   // with data in req.body (fields to be updated)
//   post = _.extend(post, req.body);
//   post.updated = Date.now();
//   post.save((err) => {
//     if (err) {
//       return res.status(400).json({
//         error: err,
//       });
//     }
//     res.json({ post });
//   });
// };

// Controller for updating a single post with photo
exports.updatePost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  // req is where the form data is coming from
  // the callback is how we handle the data
  form.parse(req, (err, fields, files) => {
    console.log("UPDATE USER FORM DATA ", fields, files);
    if (err) {
      console.log("UPDATE USER ERR =====> ", err);
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    console.table({ err, fields, files });

    let post = req.post;
    post = _.extend(post, fields);
    post.updated = Date.now();

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      post.hashed_password = undefined;
      post.salt = undefined;
      res.json(post);
    });
  });
};

exports.postPhoto = (req, res, next) => {
  // Check whether the post has an uploaded image
  if (req.post.photo.data) {
    res.set("Content-Type", req.post.photo.ContentType);
    return res.send(req.post.photo.data);
  }
  next();
};

exports.singlePost = (req, res, next) => {
  return res.json(req.post);
};

// postId and userId is sent from
// client in body
exports.like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if(err) {
      return res.status(400).json({
        error:err
      })
    } else {
      res.json(result)
    }
  })
};
exports.unLike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      res.json(result);
    }
  });
};

exports.comment = (req, res) => {
  let comment = req.body.comment
  comment.postedBy = req.body.userId
  console.log("comments.postedBy ===>", req.body.userId)
  console.log("comment ===>", req.body.comment)
  console.log("postId ===>", req.body.postId)
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
  // Poster of the comment on the postcd
  .populate("comments.postedBy", "_id name")
  // Poster of the post
  .populate("postedBy", "_id name")
  .exec((err, result) => {
    if (err) {
      console.log(err)
      return res.status(400).json({
        error: err,
      });
    } else {
      res.json(result);
      console.log("result ==>", result)
    }
  });

}


exports.uncomment = (req, res) => {
  let comment = req.body.comment
  comment.postedBy = req.body.userId
  Post.findByIdAndUpdate(
    req.body.postId,
    // {_id: comment._id} tells which comment to pull
    { $pull: { comments: {_id: comment._id} } },
    { new: true }
  )
  .populate("comments.postedBy", "_id name")
  .populate("postedBy", "_id name")
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      res.json(result);
    }
  });

}


