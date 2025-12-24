import express from "express";
import { registerUser } from "../controllers/registerController.js";
import { loginUser,getMe,logoutUser } from "../controllers/authController.js";
import { refreshAccessToken } from "../controllers/refreshTokenController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const authRouter = express.Router();

authRouter.get("/me",verifyJWT, getMe);

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

authRouter.post("/refresh", refreshAccessToken);

authRouter.post("/logout", logoutUser);


export default authRouter;