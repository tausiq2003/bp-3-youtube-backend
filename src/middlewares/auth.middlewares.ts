import ApiError from "../utils/api-error";
import asyncHandler from "../utils/async-handler";
import jwt from "jsonwebtoken";
import { User } from "../models/users.models";
import type { AuthenticatedRequest } from "../types/usertype";
import validatePayload from "../utils/validation";
import { accessTokenJwt } from "../validators/token.validators";

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
                process.env.ACCESS_TOKEN_SECRET! as string,
            );

            const validatedToken = await validatePayload(
                accessTokenJwt,
                decodedToken,
            );

            const user = await User.findById(validatedToken._id).select(
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
