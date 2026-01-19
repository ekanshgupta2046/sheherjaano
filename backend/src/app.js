import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import famousSpotRoute from "./routes/famousSpotRoutes.js";
import famousFoodRoute from "./routes/famousFoodRoutes.js";
import uploadRoute from "./routes/uploadRoute.js";
import allImagesRoute from "./routes/allImagesRoute.js";
import contributionRouter from "./routes/contributionRoutes.js";
import hiddenSpotRoute from "./routes/hiddenSpotRoutes.js";
import handicraftRoute from "./routes/handicraftRoutes.js";
import historyRoute from "./routes/historyRoutes.js";
import questionRouter from "./routes/questionRoutes.js";
import replyRouter from "./routes/replyRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";

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

app.use("/api", uploadRoute);

app.use("/api/auth", authRouter);

app.use("/api/city", allImagesRoute);

app.use("/api/famous-spots", famousSpotRoute);

app.use("/api/hidden-spots", hiddenSpotRoute);

app.use("/api/famous-food", famousFoodRoute);

app.use("/api/handicrafts", handicraftRoute);

app.use("/api/history", historyRoute);

app.use("/api/contributions", contributionRouter);

app.use("/api/questions", questionRouter);

app.use("/api/replies", replyRouter);

app.use("/api/notifications", notificationRouter);


export default app;
