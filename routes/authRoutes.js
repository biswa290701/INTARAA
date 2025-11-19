const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/signin", auth.signIn);
router.post("/signup", auth.signUp);
router.get("/logout", auth.logout);

module.exports = router;
