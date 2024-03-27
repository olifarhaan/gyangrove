import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { customErrorHandlerMiddleware } from "./middlewares/customErrorHandlerMiddleware";
import responseMiddleware from "./middlewares/responseMiddleware";
import eventRouter from "./routes/eventRoutes";
import { parseCSVAndInsertToMongoDB } from "./utils/parseCSVAndInsertToMongoDB";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

export const app = express();
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
const globalLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour duration
  message: {
    statusCode: 429,
    success: false,
    message: "Too many requests, please try again later",
  },
});

app.use("/api", globalLimiter);
app.use(helmet());
app.use(mongoSanitize()); // sanitization againt NOSQL query injection
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: FRONTEND_BASE_URL })); // If the frontend will be added most probably on Vite
app.use(responseMiddleware);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Server is running...",
  });
});

app.use("/api/v1/events", eventRouter);

// Below code was run once to put all the csv data to mongoDB
// parseCSVAndInsertToMongoDB('./utils/eventData.csv');

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`) as any;
  error.statusCode = 404;
  next(error);
});

app.use(customErrorHandlerMiddleware);
