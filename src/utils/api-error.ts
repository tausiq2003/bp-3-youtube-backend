class ApiError<T> extends Error {
    statusCode: number;
    data: T | null;
    success: false;
    errors: string[] = [];
    stack?: string;
    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors: string[] = [],
        stack = "",
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default ApiError;
