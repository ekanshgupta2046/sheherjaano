import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import famousSpotRoute from "./routes/famousSpotRoutes.js";

const app = express();

// Middlewares


app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,               // allow cookies / auth headers
}));

app.use(express.json());

app.use(cookieParser());

// Default route
app.get("/", (req, res) => {
  res.send("✅ Sheherjaano backend is running!");
});

app.use("/api/auth", authRouter);

app.use("/api/famous-spots", famousSpotRoute);

export default app;
