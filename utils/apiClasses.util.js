class ApiError extends Error{
    constructor(message="An error occurred", statusCode=500, name="ApiError") {
        super(message);
        this.statusCode = statusCode;
    }
}

class ZodValidationError extends Error{
    constructor(error, message="Zod Validation Error", statusCode=400) {
        super(message);
        this.error = error;
        this.statusCode = statusCode;
        this.name = "ZodError";
    }
}

class ApiResponse{
    constructor(content, statusCode=200) {
        this.content = content;
        this.statusCode = statusCode;
    }
}

export {ApiError, ApiResponse, ZodValidationError};
