import z from "zod";

export const playlistCreateValidator = z.object({
    name: z
        .string()
        .regex(/^[A-Za-z]+$/)
        .min(5, { message: "Title must be atleast 5 characters" })
        .max(10, {
            message: "Title must be atmost 50 characters",
        }),

    description: z
        .string()
        .max(2000, { message: "Description must be atmost 2000 characters" }),
});
