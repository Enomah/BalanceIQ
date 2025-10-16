import express from "express"
import { auth } from "../middleware/auth.js"
import { getDashboardData } from "../controllers/dashboard/dasboard.js"
import { addExpense } from "../controllers/dashboard/addExpense.js"
import { addIncome } from "../controllers/dashboard/addIncome.js"
import { fundGoal } from "../controllers/dashboard/fundGoal.js"
import { createGoal } from "../controllers/dashboard/createGoal.js"
import { withdrawalFromGoal } from "../controllers/dashboard/withdrawFromGoal.js"
import { getTransactions } from "../controllers/dashboard/getTransactions.js"

const router = express.Router()

router.get("/", auth, getDashboardData)
router.post("/expenses", auth, addExpense)
router.post("/incomes", auth, addIncome)
router.get("/transactions", auth, getTransactions)
router.post("/goals/", auth, createGoal)
router.post("/goals/:id/fund", auth, fundGoal)
router.post("/goals/:id/withdraw", auth, withdrawalFromGoal)

export default router