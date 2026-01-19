import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import {
  createReply,
  createNestedReply,
  getRepliesByQuestion,
  updateReply,
  deleteReply,
  upvoteReply,
  downvoteReply,
} from "../controllers/replyController.js";

const replyRouter = express.Router();

// GET all replies for a question
replyRouter.get("/question/:questionId", getRepliesByQuestion);

// POST create reply to question (protected)
replyRouter.post("/", verifyJWT, createReply);

// POST create nested reply (protected)
replyRouter.post("/nested", verifyJWT, createNestedReply);

// PATCH update reply (protected)
replyRouter.patch("/:replyId", verifyJWT, updateReply);

// DELETE reply (protected)
replyRouter.delete("/:replyId", verifyJWT, deleteReply);

// POST upvote reply (protected)
replyRouter.post("/:replyId/upvote", verifyJWT, upvoteReply);

// POST downvote reply (protected)
replyRouter.post("/:replyId/downvote", verifyJWT, downvoteReply);

export default replyRouter;
