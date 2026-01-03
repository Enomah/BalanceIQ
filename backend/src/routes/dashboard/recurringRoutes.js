import express from "express";
import { auth } from "../../middleware/auth.js";
import {
  createRecurringTransaction,
  getRecurringTransactions,
  updateRecurringStatus,
  deleteRecurringTransaction,
} from "../../controllers/dashboard/recurringControllers.js";

const router = express.Router();

router.use(auth);

router.post("/", createRecurringTransaction);
router.get("/", getRecurringTransactions);
router.patch("/:id", updateRecurringStatus);
router.delete("/:id", deleteRecurringTransaction);

export default router;
