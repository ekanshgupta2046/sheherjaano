import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const refreshAccessToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.id !== user._id.toString()) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const newAccessToken = jwt.sign(
          { id: user._id, role: user.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60s" }
        );

        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.error("Error in refreshAccessToken:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
