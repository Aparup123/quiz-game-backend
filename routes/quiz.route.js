import express from "express"
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js"
import { quizMain } from "../controllers/quiz.controller.js"
const quizRouter = express.Router()

quizRouter.get("/",isLoggedIn, quizMain)

export default quizRouter;