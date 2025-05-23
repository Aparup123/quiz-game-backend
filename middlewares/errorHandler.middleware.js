import { ApiError } from "../utils/apiClasses.util.js"

const errorHandler=(err, req, res, next)=>{
    if(err instanceof ApiError){
        console.log(err.name);
        console.log({
            message:err.message,
            statusCode:err.statusCode
        });
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
}

export default errorHandler;