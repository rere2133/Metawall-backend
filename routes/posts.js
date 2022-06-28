const express = require("express");
const router = express.Router();

const PostControllers = require("../controllers/post");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/auth");

//posts CRUD
router.get("/posts", isAuth, handleErrorAsync(PostControllers.getPosts));
router.post("/posts", isAuth, handleErrorAsync(PostControllers.createPosts));
router.delete(
  "/posts",
  isAuth,
  handleErrorAsync(PostControllers.deleteAllPosts)
);
router.delete(
  "/post/:id",
  isAuth,
  handleErrorAsync(PostControllers.deletePost)
);
router.patch("/post/:id", isAuth, handleErrorAsync(PostControllers.editPost));
// toggle likes
router.post(
  "/post/:id/likes",
  isAuth,
  handleErrorAsync(PostControllers.addLike)
);
router.delete(
  "/post/:id/likes",
  isAuth,
  handleErrorAsync(PostControllers.deleteLike)
);
router.post(
  "/post/:id/comment",
  isAuth,
  handleErrorAsync(PostControllers.createComment)
);

// user
router.get("/posts/user/:id", handleErrorAsync(PostControllers.getUserPosts));
//options
router.options("/posts", isAuth, handleErrorAsync(PostControllers.cors));

module.exports = router;
