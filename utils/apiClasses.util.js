class ApiError extends Error{
    constructor(message="An error occurred", statusCode=500) {
        super(message);
        this.statusCode = statusCode;
    }
}

class ApiResponse{
    constructor(content, statusCode=200) {
        this.content = content;
        this.statusCode = statusCode;
    }
}

export {ApiError, ApiResponse};
