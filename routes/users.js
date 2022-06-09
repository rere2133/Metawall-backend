const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/auth");

router.post("/sign_up", handleErrorAsync(userControllers.signUp));
router.post("/sign_in", handleErrorAsync(userControllers.signIn));
router.get("/profile", isAuth, handleErrorAsync(userControllers.getProfile));
router.patch("/profile", isAuth, handleErrorAsync(userControllers.editProfile));
router.post(
  "/updatePassword",
  isAuth,
  handleErrorAsync(userControllers.editPassword)
);
router.get(
  "/getLikeList",
  isAuth,
  handleErrorAsync(userControllers.getLikeList)
);

module.exports = router;
