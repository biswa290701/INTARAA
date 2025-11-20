import { Router } from "express";
import { contactForm, demoForm } from "../controllers/contactController.js";

const router = Router();

router.post("/contact", contactForm);
router.post("/demo", demoForm);

export default router;
