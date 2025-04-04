import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../Controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = express.Router();

router.get("/", passport.authenticate("jwt", { session: false }), authorize(["admin"]), getUsers);
router.get("/:id", passport.authenticate("jwt", { session: false }), authorize(["admin", "user"]), getUserById);
router.put("/:id", passport.authenticate("jwt", { session: false }), authorize(["admin", "user"]), updateUser);
router.post("/", passport.authenticate("jwt", { session: false }), authorize(["admin"]), createUser);        
router.delete("/:id", passport.authenticate("jwt", { session: false }), authorize(["admin"]), deleteUser);     


export default router;
