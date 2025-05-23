import { ApiError } from "../utils/apiClasses.util.js"
import jwt from "jsonwebtoken";
const isLoggedIn = async(req, res, next) => {
    if (!req.cookies.token) {
        throw new ApiError("Unauthorized", 401);
    }
    const token=req.cookies.token;
    const userData=await jwt.verify(token, process.env.JWT_SECRET);
    if (!userData) {
        throw new ApiError("Unauthorized", 401);
    }
    req.user=userData;
    next();
}

export default isLoggedIn;
