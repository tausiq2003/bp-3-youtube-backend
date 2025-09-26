import z from "zod";
import ApiError from "./api-error";
export default async function validatePayload<T extends z.ZodRawShape>(
    validation: z.ZodObject<T, z.core.$strip>,
    payload: unknown,
) {
    const validationResult = await validation.safeParseAsync(payload);

    if (!validationResult.success) {
        const prettyErrors = validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
            code: issue.code,
        }));
        const errorMessages = prettyErrors.map(
            (error) => `${error.field}: ${error.message} (Code: ${error.code})`,
        );
        throw new ApiError(400, "Validation failed", errorMessages);
    }
    const validationData = validationResult.data;
    return validationData;
}
