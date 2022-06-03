const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../services/handleErrorAsync");
const userControllers = require("../controllers/user.js");

router.post("/sign_up", handleErrorAsync(userControllers.signUp));
router.post("/sign_in", handleErrorAsync(userControllers.signIn));

module.exports = router;
