import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate tokens
    const accessToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // 6. Send refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,        // true in production (https)
      sameSite: "None",    // required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 7. Success response
    res.status(200).json({
      message: `Welcome ${user.username}!`,
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    // req.user comes from verifyJWT
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // If no refresh token, just clear cookie and exit
    if (!refreshToken) {
      return res
        .clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(204)
        .json({ message: "Logged out" });
    }

    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = "";
      await user.save();
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};
