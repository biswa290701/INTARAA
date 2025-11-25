import express from "express";
import handleCaseUpload, { serveUploadPage } from "../controllers/caseUploadController.js"

const router = express.Router();

router.get("/caseUpload", serveUploadPage);   // serve upload form
router.post("/caseUpload", handleCaseUpload);       // handle form submission

export default router;
