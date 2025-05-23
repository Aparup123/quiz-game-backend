import express from 'express';
import { signIn, signOut, signUp } from '../controllers/user.controller.js';
const userRouter=express.Router();

userRouter.get("/", (req, res) => {
    res.send("User Route");
});

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.post("/signout", signOut);

export default userRouter;