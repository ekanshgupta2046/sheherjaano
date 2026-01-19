import Question from "../models/questionModel.js";
import Reply from "../models/replyModel.js";
import Notification from "../models/notificationModel.js";

// CREATE QUESTION
export const createQuestion = async (req, res) => {
  try {
    const { cityName, stateName, title, description, authorRole, showAuthorProfile } = req.body;
    const authorId = req.user._id; // from JWT middleware
    const authorName = req.user.username;

    // Validation
    if (!cityName || !stateName || !title || !description || !authorRole) {
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

    const question = await Question.create({
      cityName: cityName.toLowerCase(),
      stateName: stateName.toLowerCase(),
      authorId,
      authorName,
      authorRole,
      showAuthorProfile: showAuthorProfile !== false,
      title,
      description,
      isVerifiedAuthor: req.user.role === "contributor", // Mark as verified if user is contributor
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating question",
      error: error.message,
    });
  }
};

// GET ALL QUESTIONS FOR A CITY
export const getQuestionsByCity = async (req, res) => {
  try {
    const { cityName, stateName } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const questions = await Question.find({
      cityName: cityName.toLowerCase(),
      stateName: stateName.toLowerCase(),
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Question.countDocuments({
      cityName: cityName.toLowerCase(),
      stateName: stateName.toLowerCase(),
    });

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
      error: error.message,
    });
  }
};

// GET SINGLE QUESTION
export const getQuestionDetail = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching question",
      error: error.message,
    });
  }
};

// UPDATE QUESTION (only author)
export const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { title, description } = req.body;
    const userId = req.user._id;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if user is the author
    if (question.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own questions",
      });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { title, description, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating question",
      error: error.message,
    });
  }
};

// DELETE QUESTION (only author)
export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user._id;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if user is the author
    if (question.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own questions",
      });
    }

    // Delete all replies to this question
    await Reply.deleteMany({ questionId });

    // Delete all notifications for this question
    await Notification.deleteMany({ questionId });

    // Delete the question
    await Question.findByIdAndDelete(questionId);

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting question",
      error: error.message,
    });
  }
};
