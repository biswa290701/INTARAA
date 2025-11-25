import express from "express";
import handleChat from "../controllers/chatController.js";
import handleScoreChat from "../controllers/scoreChatController.js";

const router = express.Router();

router.post("/chat", handleChat);
router.post("/scoreChat", handleScoreChat);

export default router;
