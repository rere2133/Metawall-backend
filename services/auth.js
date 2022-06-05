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
  console.log({ decoded });
  const currentUser = await User.findById(decoded.id);
  req.user = currentUser;
  next();
});

const generateJWT = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.status(statusCode).json({
    user: user.name,
    token,
  });
};

module.exports = {
  isAuth,
  generateJWT,
};
