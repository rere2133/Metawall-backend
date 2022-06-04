const handleErrorAsync = require("./handleErrorAsync");
const appError = require("./appError");
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

const generateJWT = (user, statusCode, res) => {
  //產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = null;
  res.status(statusCode).json({
    name: user.name,
    token,
  });
};
module.exports = {
  isAuth,
  generateJWT,
};
