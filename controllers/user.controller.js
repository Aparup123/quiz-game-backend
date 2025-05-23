import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiClasses.util.js";

const signIn=async (req, res, next)=>{
    try{
        const { email, password } = req.body;
        // Validate the input
        if (!email || !password) {
            throw new ApiError("Email and password are required",401);
        }
    
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
    const { name, email, password } = req.body;
    // Validate the input   
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
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
}

const signOut=(req, res, next)=>{
    res.cookie("token", "", {
        httpOnly: true,
    });
    res.status(200).json("Successfully signed out");
}


export { signIn, signUp, signOut };