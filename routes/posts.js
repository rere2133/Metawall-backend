var express = require("express");
var router = express.Router();

const PostControllers = require("../controllers/post");
const handleErrorAsync = require("../services/handleErrorAsync");

router.get("/posts", handleErrorAsync(PostControllers.getPosts));
router.post("/posts", handleErrorAsync(PostControllers.createPosts));
router.delete("/posts", handleErrorAsync(PostControllers.deleteAllPosts));
router.delete("/post/:id", handleErrorAsync(PostControllers.deletePost));
router.patch("/post/:id", handleErrorAsync(PostControllers.editPost));
router.options("/posts", handleErrorAsync(PostControllers.cors));

module.exports = router;
