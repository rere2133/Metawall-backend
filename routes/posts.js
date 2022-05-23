var express = require("express");
var router = express.Router();

const PostControllers = require("../controllers/post");

router.get("/", PostControllers.getPosts);
router.post("/", PostControllers.createPosts);
router.delete("/", PostControllers.deleteAllPosts);
router.delete("/:id", PostControllers.deletePost);
router.patch("/:id", PostControllers.editPost);
router.options("/", PostControllers.cors);

module.exports = router;
