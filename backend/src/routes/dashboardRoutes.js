import express from "express";
import { auth } from "../middleware/auth.js";
import { getDashboardData } from "../controllers/dashboard/dasboard.js";
import { addExpense } from "../controllers/dashboard/addExpense.js";
import { addIncome } from "../controllers/dashboard/addIncome.js";
import { fundGoal } from "../controllers/dashboard/fundGoal.js";
import { createGoal } from "../controllers/dashboard/createGoal.js";
import { withdrawalFromGoal } from "../controllers/dashboard/withdrawFromGoal.js";
import { getTransactions } from "../controllers/dashboard/getTransactions.js";
import { getSummary } from "../controllers/dashboard/getSummary.js";
import { getGoals } from "../controllers/dashboard/goals/getGoals.js";
import { getCompletedGoals } from "../controllers/dashboard/goals/getCompletedGoals.js";
import { getGoalsStats } from "../controllers/dashboard/goals/getGoalsStats.js";
import { createMonthlyBudget } from "../controllers/dashboard/budgeting/createMonthlyBudget.js";

import { getMonthlyBudget } from "../controllers/dashboard/budgeting/getMonthlyBudget.js"
import { updateMonthlyBudget } from "../controllers/dashboard/budgeting/updateMonthlyBudget.js";

const router = express.Router();

router.get("/", auth, getDashboardData);
router.post("/expenses", auth, addExpense);
router.post("/incomes", auth, addIncome);

router.get("/transactions", auth, getTransactions);
router.get("/summary", auth, getSummary);

router.post("/goals/", auth, createGoal);
router.get("/goals/stats", auth, getGoalsStats);
router.get("/goals/active", auth, getGoals);
router.get("/goals/completed", auth, getCompletedGoals);
router.post("/goals/:id/fund", auth, fundGoal);
router.post("/goals/:id/withdraw", auth, withdrawalFromGoal);

router.post("/budget", auth, createMonthlyBudget);
router.get("/budget", auth, getMonthlyBudget);
router.put("/budget/:id", auth, updateMonthlyBudget);

export default router;
