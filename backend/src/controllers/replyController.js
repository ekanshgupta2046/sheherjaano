import Reply from "../models/replyModel.js";
import Question from "../models/questionModel.js";
import Notification from "../models/notificationModel.js";

// CREATE REPLY TO QUESTION
export const createReply = async (req, res) => {
  try {
    const { questionId, content, authorRole, showAuthorProfile } = req.body;
    const authorId = req.user._id;
    const authorName = req.user.username;

    // Validation
    if (!questionId || !content || !authorRole) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!["tourist", "resident"].includes(authorRole)) {
      return res.status(400).json({
        success: false,
        message: "Author role must be 'tourist' or 'resident'",
      });
    }

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Create reply
    const reply = await Reply.create({
      questionId,
      authorId,
      authorName,
      authorRole,
      showAuthorProfile: showAuthorProfile !== false,
      content,
      isVerifiedAuthor: req.user.role === "contributor",
    });

    // Increment reply count on question
    await Question.findByIdAndUpdate(
      questionId,
      { $inc: { replyCount: 1 } },
      { new: true }
    );

    // Create notification for question author (if not the same person)
    if (question.authorId.toString() !== authorId) {
      await Notification.create({
  recipientId: question.authorId,
  senderId: authorId,
  type: "reply_to_question",
  questionId,
  replyId: reply._id,
  state: question.stateName,
  city: question.cityName,
  message: `${authorName} replied to your question`,
});

    }

    res.status(201).json({
      success: true,
      message: "Reply created successfully",
      reply,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating reply",
      error: error.message,
    });
  }
};

// CREATE NESTED REPLY (reply to a reply)
export const createNestedReply = async (req, res) => {
  try {
    const { parentReplyId, content, authorRole, showAuthorProfile } = req.body;
    const authorId = req.user._id;
    const authorName = req.user.username;

    // Validation
    if (!parentReplyId || !content || !authorRole) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!["tourist", "resident"].includes(authorRole)) {
      return res.status(400).json({
        success: false,
        message: "Author role must be 'tourist' or 'resident'",
      });
    }

    // Check if parent reply exists
    const parentReply = await Reply.findById(parentReplyId);
    if (!parentReply) {
      return res.status(404).json({
        success: false,
        message: "Parent reply not found",
      });
    }

    // Create nested reply
    const nestedReply = await Reply.create({
      questionId: parentReply.questionId,
      parentReplyId,
      authorId,
      authorName,
      authorRole,
      showAuthorProfile: showAuthorProfile !== false,
      content,
      isVerifiedAuthor: req.user.role === "contributor",
    });

    // Create notification for parent reply author (if not the same person)
    if (parentReply.authorId.toString() !== authorId) {
      const question = await Question.findById(parentReply.questionId);

await Notification.create({
  recipientId: parentReply.authorId,
  senderId: authorId,
  type: "reply_to_reply",
  questionId: parentReply.questionId,
  replyId: nestedReply._id,
  state: question.stateName,
  city: question.cityName,
  message: `${authorName} replied to your reply`,
});

    }

    res.status(201).json({
      success: true,
      message: "Nested reply created successfully",
      reply: nestedReply,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating nested reply",
      error: error.message,
    });
  }
};

// GET ALL REPLIES FOR A QUESTION
export const getRepliesByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    // 1. Fetch ALL replies for the question
    const replies = await Reply.find({ questionId })
      .sort({ createdAt: 1 })
      .lean();

    // 2. Prepare a map for O(1) access
    const replyMap = {};
    replies.forEach(r => {
      replyMap[r._id] = { ...r, children: [] };
    });

    const rootReplies = [];

    // 3. Build the tree
    replies.forEach(r => {
      if (r.parentReplyId) {
        // push into its parent
        replyMap[r.parentReplyId].children.push(replyMap[r._id]);
      } else {
        // top-level reply
        rootReplies.push(replyMap[r._id]);
      }
    });

    res.status(200).json({
      success: true,
      replies: rootReplies,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching replies",
      error: error.message,
    });
  }
};


// UPDATE REPLY (only author)
export const updateReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const reply = await Reply.findById(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    // Check if user is the author
    if (reply.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own replies",
      });
    }

    const updatedReply = await Reply.findByIdAndUpdate(
      replyId,
      { content, editedAt: Date.now(), updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Reply updated successfully",
      reply: updatedReply,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating reply",
      error: error.message,
    });
  }
};

// DELETE REPLY (only author)
export const deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user._id;

    const reply = await Reply.findById(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    // Check if user is the author
    if (reply.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own replies",
      });
    }

    const questionId = reply.questionId;

    // Delete nested replies if this is a top-level reply
    if (!reply.parentReplyId) {
      await Reply.deleteMany({ parentReplyId: replyId });
    }

    // Delete notifications related to this reply
    await Notification.deleteMany({ replyId });

    // Delete the reply
    await Reply.findByIdAndDelete(replyId);

    // Decrement reply count on question
    await Question.findByIdAndUpdate(
      questionId,
      { $inc: { replyCount: -1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Reply deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting reply",
      error: error.message,
    });
  }
};

// UPVOTE REPLY
export const upvoteReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user._id;

    const reply = await Reply.findById(replyId);

    if (!reply) {
      return res.status(404).json({ success: false, message: "Reply not found" });
    }

    const hasUpvoted = reply.upvotedBy.includes(userId);
    const hasDownvoted = reply.downvotedBy.includes(userId);

    // Undo upvote
    if (hasUpvoted) {
      reply.upvotedBy.pull(userId);
    } 
    else {
      // Add upvote
      reply.upvotedBy.push(userId);

      // Remove downvote if exists
      if (hasDownvoted) {
        reply.downvotedBy.pull(userId);
      }
    }

    reply.upvotes = reply.upvotedBy.length;
    reply.downvotes = reply.downvotedBy.length;

    await reply.save();

    res.status(200).json({
      success: true,
      message: "Upvote updated",
      reply,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error upvoting",
      error: error.message,
    });
  }
};


// DOWNVOTE REPLY
export const downvoteReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user._id;

    const reply = await Reply.findById(replyId);

    if (!reply) {
      return res.status(404).json({ success: false, message: "Reply not found" });
    }

    const hasUpvoted = reply.upvotedBy.includes(userId);
    const hasDownvoted = reply.downvotedBy.includes(userId);

    // Undo downvote
    if (hasDownvoted) {
      reply.downvotedBy.pull(userId);
    } 
    else {
      // Add downvote
      reply.downvotedBy.push(userId);

      // Remove upvote if exists
      if (hasUpvoted) {
        reply.upvotedBy.pull(userId);
      }
    }

    reply.upvotes = reply.upvotedBy.length;
    reply.downvotes = reply.downvotedBy.length;

    await reply.save();

    res.status(200).json({
      success: true,
      message: "Downvote updated",
      reply,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error downvoting",
      error: error.message,
    });
  }
};

