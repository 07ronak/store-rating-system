import express from "express";
import {
  getStores,
  submitRating,
  updateRating,
} from "../controllers/userController";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

// All routes require USER role
router.use(authenticate, authorize("USER"));

router.get("/stores", getStores);
router.post("/ratings", submitRating);
router.put("/ratings", updateRating);

export default router;
