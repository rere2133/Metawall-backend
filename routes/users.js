const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/auth");

router.post("/sign_up", handleErrorAsync(userControllers.signUp));
router.post("/sign_in", handleErrorAsync(userControllers.signIn));
router.get("/profile", isAuth, handleErrorAsync(userControllers.getProfile));
router.post(
  "/updatePassword",
  isAuth,
  handleErrorAsync(userControllers.editPassword)
);

module.exports = router;
