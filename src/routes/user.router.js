import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "./controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authorize(["admin"]), getUsers);
router.get("/", getUsers);           
router.get("/:id", authorize(["admin", "user"]), getUserById);      
router.post("/", createUser);        
router.put("/:id", authorize(["admin", "user"]), updateUser);      
router.delete("/:id", authorize(["admin"]), deleteUser);  

export default router;
