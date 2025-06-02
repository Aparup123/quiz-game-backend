import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError, ZodValidationError } from "../utils/apiClasses.util.js";
import {signInSchema, signUpSchema} from "../utils/zodSchemas.js";



const signIn=async (req, res, next)=>{
    try{
        // Validate the input using zod schema
        const parsedData = signInSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new ZodValidationError(parsedData.error);
        }
        const { email, password } = req.body;
    
        const user=await User.findOne({ email });
        if (!user) {
            throw new ApiError("Invalid email or password",401);
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError("Invalid email or password",401);
        }
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
        });
        res.status(200).json("Signed in successfully");
    }
    catch (error) {
        next(error);
    }
    
}

const signUp=async (req, res)=>{
    try{
        const parsedData = signUpSchema.safeParse(req.body);
        if(!parsedData.success){
            throw new ZodValidationError(parsedData.error);
        }
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError("User already exists", 409);
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser=await newUser.save();
        // Generate JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
        }); 
        const user=savedUser.toObject();
        delete user.password;
        res.status(201).json({ message: "User created successfully", user: user });
    }catch(err){
        next(err);
    }
    
}

const signOut=(req, res, next)=>{
    res.cookie("token", "", {
        httpOnly: true,
    });
    res.status(200).json("Successfully signed out");
}


export { signIn, signUp, signOut };