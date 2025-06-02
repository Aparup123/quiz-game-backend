import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import 'dotenv/config';
import errorHandler from './middlewares/errorHandler.middleware.js';
import quizRouter from './routes/quiz.route.js';
import cookieParser from 'cookie-parser';


const app=express();
app.use(cookieParser());
app.use(express.json());
app.use("/users", userRouter);
app.use("/quiz", quizRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use(errorHandler);

const PORT=process.env.PORT || 4000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/quiz-game";
mongoose.connect(MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

