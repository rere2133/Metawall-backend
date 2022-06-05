const appError = (code, msg, next) => {
  // console.log("in appError");
  const err = new Error(msg);
  err.statusCode = code;
  err.isOperational = true;
  next(err);
};
module.exports = appError;
