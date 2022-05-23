const handleError = (res, code = 400, msg = "欄位輸入錯誤或無此ID") => {
  console.log("in error");
  if (msg != "options") {
    res.status(code).json({
      status: false,
      msg,
    });
  }
};
module.exports = handleError;
