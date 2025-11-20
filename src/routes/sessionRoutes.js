import { Router } from "express";
import { sessionUser } from "../controllers/sessionController.js";

const router = Router();

router.get("/session-user", sessionUser);

export default router;
