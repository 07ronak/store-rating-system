import express from "express";
import {
  getDashboardStats,
  createUser,
  createStore,
  getStores,
  getUsers,
} from "../controllers/adminController";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

// All routes require ADMIN role
router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard/stats", getDashboardStats);
router.post("/users", createUser);
router.post("/stores", createStore);
router.get("/stores", getStores);
router.get("/users", getUsers);

export default router;
