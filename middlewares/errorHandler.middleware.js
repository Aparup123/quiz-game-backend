import { ApiError, ZodValidationError } from "../utils/apiClasses.util.js"
import {z} from "zod/v4";
const errorHandler=(err, req, res, next)=>{
    if(err instanceof ApiError){
        console.log(err.name);
        console.log({
            message:err.message,
            statusCode:err.statusCode
        });
        return res.status(err.statusCode).json({ message: err.message });
    }
    if(err instanceof ZodValidationError){
        const issues=err.error.issues;
        var errorObj={};
        issues.map((issue) => errorObj[issue.path[0]]=issue.message);
        console.error(errorObj);
        return res.status(err.statusCode).json({ message: "Validation Error", errors: errorObj });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
}

export default errorHandler;