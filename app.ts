import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { customErrorHandlerMiddleware } from "./middlewares/customErrorHandlerMiddleware";
import responseMiddleware from "./middlewares/responseMiddleware";
import eventRouter from "./routes/eventRoutes";
import { parseCSVAndInsertToMongoDB } from "./utils/parseCSVAndInsertToMongoDB";

export const app = express();
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({ origin: FRONTEND_BASE_URL }));
app.use(responseMiddleware);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Server is running...",
  });
});

app.use("/api/v1/events", eventRouter);
// parseCSVAndInsertToMongoDB('./utils/eventData.csv');

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`) as any;
  error.statusCode = 404;
  next(error);
});

app.use(customErrorHandlerMiddleware);
