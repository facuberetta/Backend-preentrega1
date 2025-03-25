import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { authenticateJWT, authorizeRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateJWT, getUsers);

router.delete("/:id", authenticateJWT, authorizeRole("admin"), deleteUser);

export default router;
