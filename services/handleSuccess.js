const Post = require("../models/postModel");
const User = require("../models/userModel");

const handleSuccess = async (res, msg, posts) => {
  if (msg != "options") {
    let newPosts = [];
    if (posts) {
      newPosts = posts;
    } else {
      newPosts = await Post.find()
        .populate({
          path: "user",
          select: "name photo",
        })
        .populate({
          path: "comments",
          select: "comment user",
        });
    }
    res.status(200).json({
      status: true,
      msg,
      posts: newPosts,
    });
  }
};
module.exports = handleSuccess;
