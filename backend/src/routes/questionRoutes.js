import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import {
  createQuestion,
  getQuestionsByCity,
  getQuestionDetail,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

const questionRouter = express.Router();

// GET single question detail (MUST be before :stateName/:cityName route)
questionRouter.get("/detail/:questionId", getQuestionDetail);

// GET all questions for a city
questionRouter.get("/:stateName/:cityName", getQuestionsByCity);

// POST create new question (protected)
questionRouter.post("/", verifyJWT, createQuestion);

// PATCH update question (protected)
questionRouter.patch("/:questionId", verifyJWT, updateQuestion);

// DELETE question (protected)
questionRouter.delete("/:questionId", verifyJWT, deleteQuestion);

export default questionRouter;
