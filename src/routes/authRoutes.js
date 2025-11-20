import { Router } from "express";
import { signIn, signUp, logout } from "../controllers/authController.js";

const router = Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/logout", logout);

export default router;
