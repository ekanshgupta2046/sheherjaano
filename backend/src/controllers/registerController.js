import User from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    //Manual checks
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(409).json({ message: "Email already registered" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(409).json({ message: "Username already taken" });

    // Create new user
    const newUser = new User({ username, email, password, role: "user" });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);

    // Catch race-condition duplicates (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      return res.status(409).json({ message: msg });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};



