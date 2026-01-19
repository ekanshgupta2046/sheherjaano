import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const refreshAccessToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const oldRefreshToken = cookies.refreshToken;
    const user = await User.findOne({ refreshToken: oldRefreshToken });
    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
    }

    jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err || decoded._id !== user._id.toString()) {
          return res.status(403).json({ message: "Forbidden" });
        }

        // Generate NEW tokens
        const newAccessToken = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60s" }
        );

        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        // ROTATE refresh token in DB
        user.refreshToken = newRefreshToken;
        await user.save();

        // Replace cookie
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          path: "/", 
          maxAge: 24 * 60 * 60 * 1000,
        });

        // Send new access token
        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.error("Error in refreshAccessToken:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
