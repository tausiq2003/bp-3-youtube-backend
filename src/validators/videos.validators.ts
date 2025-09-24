import z from "zod";

export const publishVideoValidator = z.object({
    title: z
        .string()
        .min(5, { message: "Title must be atleast 5 characters" })
        .max(50, {
            message: "Title must be atmost 50 characters",
        }),

    description: z
        .string()
        .max(2000, { message: "Description must be atmost 2000 characters" }),
});
