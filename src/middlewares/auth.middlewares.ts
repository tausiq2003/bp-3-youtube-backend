import ApiError from "../utils/api-error";
import asyncHandler from "../utils/async-handler";
import jwt from "jsonwebtoken";
import { User } from "../models/users.models";
import type { AuthenticatedRequest } from "../types/usertype";

export const verifyJWT = asyncHandler(
    async (req: AuthenticatedRequest, _, next) => {
        try {
            const token =
                req.cookies?.accessToken ||
                req.header("Authorization")?.replace("Bearer ", "");

            // console.log(token);
            if (!token) {
                throw new ApiError(401, "Unauthorized request");
            }

            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET,
            );

            const user = await User.findById(decodedToken?._id).select(
                "-password -refreshToken",
            );

            if (!user) {
                throw new ApiError(401, "Invalid Access Token");
            }

            req.user = user;
            next();
        } catch (error) {
            throw new ApiError(
                401,
                (error as Error)?.message || "Invalid access token",
            );
        }
    },
);
