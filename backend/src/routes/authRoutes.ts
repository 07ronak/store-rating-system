import express from "express";
import { signup, login, updatePassword } from "../controllers/authController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/change-password", authenticate, updatePassword);

export default router;
