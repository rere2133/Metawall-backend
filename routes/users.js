const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user");
const handleErrorAsync = require("../services/handleErrorAsync");

const appError = require("../services/appError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return appError(400, "你尚未登入！", next);
  }
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  const currentUser = await User.findById(decoded.id);
  req.user = currentUser;
  next();
});

router.post("/sign_up", handleErrorAsync(userControllers.signUp));
router.post("/sign_in", handleErrorAsync(userControllers.signIn));
router.get("/profile", isAuth, handleErrorAsync(userControllers.getProfile));

module.exports = router;
