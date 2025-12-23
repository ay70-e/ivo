import express from "express";
import { login, register, updateUser, changePassword, getProfile } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, updateUser);
router.put("/change-password", authenticate, changePassword);
export default router;
