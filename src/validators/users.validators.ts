import { z } from "zod";

export const registerValidator = z.object({
    fullName: z
        .string()
        .min(5, "Full name must be at least 5 characters long.")
        .max(50, "Full name must be at most 50 characters long.")
        .regex(
            /^(?! )[A-Z][a-z]+(?: [A-Z][a-z]+){0,3}(?<! )$/,
            "Full name must be 1 to 4 words, start with uppercase letters, contain only alphabetic characters, and have no leading or trailing spaces.",
        ),

    email: z.email("Invalid email address."),

    username: z
        .string()
        .min(5, "Username must be at least 5 characters.")
        .max(8, "Username must be at most 8 characters.")
        .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric only."),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(64, "Password must be at most 64 characters long.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(
            /[^a-zA-Z0-9]/,
            "Password must contain at least one special character.",
        ),
});

export const loginValidator = z.object({
    email: z.email("Invalid email address"),
    username: z
        .string()
        .min(5, "Username must be at least 5 characters.")
        .max(8, "Username must be at most 8 characters.")
        .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric only."),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(64, "Password must be at most 64 characters long.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(
            /[^a-zA-Z0-9]/,
            "Password must contain at least one special character.",
        ),
});

export const changePasswordValidator = z
    .object({
        oldPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(64, "Password must be at most 64 characters long")
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter.",
            )
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter.",
            )
            .regex(/[0-9]/, "Password must contain at least one number.")
            .regex(
                /[^a-zA-Z0-9]/,
                "Password must contain at least one special character.",
            ),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(64, "Password must be at most 64 characters long")
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter.",
            )
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter.",
            )
            .regex(/[0-9]/, "Password must contain at least one number.")
            .regex(
                /[^a-zA-Z0-9]/,
                "Password must contain at least one special character.",
            ),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: "New password is the same as old password",
        path: ["newPassword"],
    });
export const updateAccountValidator = z.object({
    fullName: z
        .string()
        .min(5, "Full name must be at least 5 characters long.")
        .max(50, "Full name must be at most 50 characters long.")
        .regex(
            /^(?! )[A-Z][a-z]+(?: [A-Z][a-z]+){0,3}(?<! )$/,
            "Full name must be 1 to 4 words, start with uppercase letters, contain only alphabetic characters, and have no leading or trailing spaces.",
        ),

    email: z.email("Invalid email address."),
});
