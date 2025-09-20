import express from "express";
import upload from "../middleware/multer.js";
import { onboard } from "../controllers/onboarding/onboard.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/onboard", auth, upload.single("avatar"), onboard);

export default router;
