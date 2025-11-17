import express from "express";
import { getDashboard } from "../controllers/storeOwnerController";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

// All routes require STORE_OWNER role
router.use(authenticate, authorize("STORE_OWNER"));

router.get("/dashboard", getDashboard);

export default router;
