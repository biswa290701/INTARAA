const express = require("express");
const router = express.Router();
const password = require("../controllers/passwordController");

router.post("/forgot-password", password.forgotPassword);
router.post("/reset-password", password.resetPassword);

module.exports = router;
