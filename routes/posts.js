const express = require("express");
const router = express.Router();

const PostControllers = require("../controllers/post");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/auth");

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
router.post(
  "/post/:id/likes",
  isAuth,
  handleErrorAsync(PostControllers.addLike)
);

router.options("/posts", isAuth, handleErrorAsync(PostControllers.cors));

module.exports = router;
