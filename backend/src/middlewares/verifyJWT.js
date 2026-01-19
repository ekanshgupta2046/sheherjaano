// middleware/verifyJWT.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      // Standard HTTP: 401 = Unauthorized (invalid/expired token)
      return res.status(401).json({ message: "Unauthorized (invalid or expired token)" });
    }

    try {
      // Fetch user from database to get username
      const userId = decoded._id || decoded.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Support tokens that store the id as either `_id` or `id`
      req.user = {
        _id: userId,
        id: userId, // For backward compatibility
        username: user.username,
        role: decoded.role,
      };

      next();
    } catch (error) {
      console.error("Error in verifyJWT:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

export default verifyJWT;
