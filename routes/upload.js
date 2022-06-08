const express = require("express");
const router = express.Router();

const uploadControllers = require("../controllers/upload");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/auth");
const upload = require("../services/image");

router.post("/", isAuth, upload, handleErrorAsync(uploadControllers.uploadImg));

module.exports = router;
