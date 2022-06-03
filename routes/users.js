const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const handleErrorAsync = require("../services/handleErrorAsync");
const userControllers = require("../controllers/user.js");
const appError = require("../services/appError");
const User = require("../models/userModel");

router.post("/sign_up", handleErrorAsync(userControllers.signUp));
router.post("/sign_in", handleErrorAsync(userControllers.signIn));

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    appError(400, "你尚未登入", next);
  }
  //驗證 token
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

router.get(
  "/profile/",
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    res.status(200).json({
      status: "success",
      user: req.user,
    });
  })
);

module.exports = router;
