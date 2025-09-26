import mongoose from "mongoose";
import z from "zod";

export const accessTokenJwt = z.object({
    _id: z.custom<mongoose.Types.ObjectId>(),
    email: z.email("Invalid email address."),
    username: z
        .string()
        .min(5, "Username must be at least 5 characters.")
        .max(8, "Username must be at most 8 characters.")
        .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric only."),
    fullName: z
        .string()
        .min(5, "Full name must be at least 5 characters long.")
        .max(50, "Full name must be at most 50 characters long.")
        .regex(
            /^(?! )[A-Z][a-z]+(?: [A-Z][a-z]+){0,3}(?<! )$/,
            "Full name must be 1 to 4 words, start with uppercase letters, contain only alphabetic characters, and have no leading or trailing spaces.",
        ),
});
export const refreshTokenJwt = z.object({
    _id: z.custom<mongoose.Types.ObjectId>(),
});
