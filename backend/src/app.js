import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";

const app = express();

// Middlewares


app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,               // allow cookies / auth headers
}));

app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("✅ Sheherjaano backend is running!");
});

app.use("/api/auth", authRouter);

export default app;
