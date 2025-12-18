import express from "express";
import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/authController.js";

const authRouter = express.Router();

// Registration route
authRouter.post("/register", registerUser);

// Login route
authRouter.post("/login", loginUser);

export default authRouter;