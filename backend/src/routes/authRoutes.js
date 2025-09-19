import express from "express";
import { registerUser } from "../controllers/auth/registerUser.js";
import { requestOtp } from "../controllers/auth/requestOtp.js";
import { verifyOtp } from "../controllers/auth/verifyOtp.js";
import { login } from "../controllers/auth/login.js";
import { resetPassword } from "../controllers/auth/resetPassword.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/reset-password", resetPassword);

export default router;