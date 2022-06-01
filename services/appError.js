const appError = (code, msg, next) => {
  const err = new Error(msg);
  err.statusCode = code;
  err.isOperational = true;
  next(err);
};
module.exports = appError;
