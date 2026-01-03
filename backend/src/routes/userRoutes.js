import express from "express";
import { auth } from "../middleware/auth.js";
import { updateProfile } from "../controllers/user/updateProfile.js";
import { updateSettings } from "../controllers/user/updateSettings.js";
import { changePassword } from "../controllers/user/changePassword.js";
import { deleteAccount } from "../controllers/user/deleteAccount.js";

const router = express.Router();

// All user routes are protected
router.use(auth);

router.put("/profile", updateProfile);
router.put("/settings", updateSettings);
router.put("/change-password", changePassword);
router.delete("/account", deleteAccount);

export default router;
