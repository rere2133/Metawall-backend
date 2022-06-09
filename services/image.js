const multer = require("multer");
const path = require("path");

const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      cb(new Error("檔案格式不符，限上傳 jpg, jpeg 與 png 格式"));
    }
    cb(null, true);
  },
}).any();
module.exports = upload;
