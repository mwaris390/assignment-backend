import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user/user";
import branchRoute from "./routes/branch/branch";
import authRoute from "./routes/auth/auth";
import { VerifyTokenMiddleware } from "./middlewares/verifyToken";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3001;

app.use("/v1", authRoute);
app.use("/v1", VerifyTokenMiddleware, userRoute);
app.use("/v1", VerifyTokenMiddleware, branchRoute);

app.get("/health-check", (req: Request, res: Response) => {
  res.send("Server is running successfully");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
