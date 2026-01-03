import express from "express";
import {
  getAllShoppingLists,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
  exportShoppingListPDF,
} from "../controllers/shoppingListController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", getAllShoppingLists);
router.post("/", createShoppingList);
router.put("/:id", updateShoppingList);
router.delete("/:id", deleteShoppingList);
router.post("/:id/export", exportShoppingListPDF);

export default router;
