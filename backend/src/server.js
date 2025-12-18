import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { connect } from "http2";

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
