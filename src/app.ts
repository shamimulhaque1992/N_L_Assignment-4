import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globaErrorHandler";

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.get("/", async (req: Request, res: Response) => {
  res.send({ message: "server is running" });
});
app.use(notFound);

app.use(globalErrorHandler);

export default app;
