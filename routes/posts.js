var express = require("express");
var router = express.Router();

const PostControllers = require("../controllers/post");

router.get("/posts", PostControllers.getPosts);
router.post("/posts", PostControllers.createPosts);
router.delete("/posts", PostControllers.deleteAllPosts);
router.delete("/post/:id", PostControllers.deletePost);
router.patch("/post/:id", PostControllers.editPost);
router.options("/posts", PostControllers.cors);

module.exports = router;
