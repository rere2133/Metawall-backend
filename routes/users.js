const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user");
const handleErrorAsync = require("../services/handleErrorAsync");

router.post("/sign_up", handleErrorAsync(userControllers.signUp));
router.post("/sign_in", handleErrorAsync(userControllers.signIn));

module.exports = router;
