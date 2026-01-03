import express from "express";
import {
  exportCSV,
  exportPDF,
} from "../controllers/export/exportControllers.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/csv", auth, exportCSV);
router.get("/pdf", auth, exportPDF);

export default router;
