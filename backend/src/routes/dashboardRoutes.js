import express from "express";
import { auth } from "../middleware/auth.js";
import { getDashboardData } from "../controllers/dashboard/dasboard.js";
import { addExpense } from "../controllers/dashboard/addExpense.js";
import { addIncome } from "../controllers/dashboard/addIncome.js";
import { getTransactions } from "../controllers/dashboard/getTransactions.js";
import { getSummary } from "../controllers/dashboard/getSummary.js";
import { createMonthlyBudget } from "../controllers/dashboard/budgeting/createMonthlyBudget.js";

import { getMonthlyBudget } from "../controllers/dashboard/budgeting/getMonthlyBudget.js";
import { updateMonthlyBudget } from "../controllers/dashboard/budgeting/updateMonthlyBudget.js";
import { updateTransaction } from "../controllers/dashboard/updateTransaction.js";
import { deleteTransaction } from "../controllers/dashboard/deleteTransaction.js";
import recurringRoutes from "./dashboard/recurringRoutes.js";
import goalRoutes from "./dashboard/goalRoutes.js";

const router = express.Router();

router.get("/", auth, getDashboardData);
router.post("/expenses", auth, addExpense);
router.post("/incomes", auth, addIncome);

router.get("/transactions", auth, getTransactions);
router.put("/transactions/:id", auth, updateTransaction);
router.delete("/transactions/:id", auth, deleteTransaction);
router.get("/summary", auth, getSummary);

router.post("/budget", auth, createMonthlyBudget);
router.get("/budget", auth, getMonthlyBudget);
router.put("/budget/:id", auth, updateMonthlyBudget);

router.use("/recurring", recurringRoutes);
router.use("/goals", goalRoutes);

export default router;
