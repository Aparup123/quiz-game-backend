import express from "express"
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js"
import { createQuiz, evaluate, getQuestions, quizMain, saveResponse, startAttempt, test } from "../controllers/quiz.controller.js"
const quizRouter = express.Router()

quizRouter.get("/",isLoggedIn, quizMain)
quizRouter.get("/create-quiz", isLoggedIn, createQuiz)
quizRouter.post("/start-attempt", isLoggedIn, startAttempt) 
quizRouter.get("/questions", isLoggedIn, getQuestions)
quizRouter.post("/submit-response", isLoggedIn, saveResponse)
quizRouter.get("/evaluate", isLoggedIn, evaluate)

export default quizRouter;