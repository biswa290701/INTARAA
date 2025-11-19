const express = require("express");
const router = express.Router();
const session = require("../controllers/sessionController");

router.get("/session-user", session.sessionUser);

module.exports = router;
