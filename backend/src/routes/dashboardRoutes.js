import express from "express"
import { auth } from "../middleware/auth.js"
import { getDashboardData } from "../controllers/dashboard/dasboard.js"

const router = express.Router()

router.get("/", auth, getDashboardData)

export default router