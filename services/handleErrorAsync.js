const handleErrorAsync = (func) => {
  return function (req, res, next) {
    func(req, res, next).catch(function (err) {
      return next(err);
    });
  };
};
module.exports = handleErrorAsync;
