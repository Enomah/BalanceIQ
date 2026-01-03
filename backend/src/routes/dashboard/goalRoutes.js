import express from "express";
import { auth } from "../../middleware/auth.js";
import { createGoal } from "../../controllers/dashboard/createGoal.js";
import { getGoals } from "../../controllers/dashboard/goals/getGoals.js";
import { getCompletedGoals } from "../../controllers/dashboard/goals/getCompletedGoals.js";
import { getGoalsStats } from "../../controllers/dashboard/goals/getGoalsStats.js";
import { fundGoal } from "../../controllers/dashboard/fundGoal.js";
import { withdrawalFromGoal } from "../../controllers/dashboard/withdrawFromGoal.js";
import { deleteGoal } from "../../controllers/dashboard/deleteGoal.js";

const router = express.Router();

router.use(auth);

router.post("/", createGoal);
router.get("/active", getGoals);
router.get("/completed", getCompletedGoals);
router.get("/stats", getGoalsStats);
router.post("/:id/fund", fundGoal);
router.post("/:id/withdraw", withdrawalFromGoal);
router.delete("/:id", deleteGoal);

export default router;
