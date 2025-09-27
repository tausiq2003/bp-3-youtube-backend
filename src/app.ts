import express, { type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes";
import healthcheckRouter from "./routes/healthcheck.routes";
import tweetRouter from "./routes/tweets.routes";
import subscriptionRouter from "./routes/subscription.routes";
import videoRouter from "./routes/video.routes";
import commentRouter from "./routes/comment.routes";
import likeRouter from "./routes/like.routes";
import playlistRouter from "./routes/playlist.routes";
import dashboardRouter from "./routes/dashboard.routes";
import type { AuthenticatedRequest } from "./types/usertype";
import ApiError from "./utils/api-error";

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// http://localhost:8000/api/v1/users/register

app.use((err: Error, _req: AuthenticatedRequest, res: Response) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const errorWithStatus = error as Error & { statusCode?: number };
        const statusCode = errorWithStatus.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, [], err.stack);
    }

    const apiError = error as ApiError<unknown>;

    return res.status(apiError.statusCode).json({
        success: false,
        message: error.message,
        errors: apiError.errors,
        ...(process.env.NODE_ENV === "development" && {
            stack: error.stack,
        }),
    });
});
export default app;
