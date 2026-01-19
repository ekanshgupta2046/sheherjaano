import express from "express";
import { 
  getContributions, 
  deleteContribution 
} from "../controllers/contributionController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

// Apply verifyJWT to all routes in this file automatically
router.use(verifyJWT);

// GET /api/contributions
router.get("/", getContributions);

// DELETE /api/contributions/:id
router.delete("/:id", deleteContribution);

export default router;
