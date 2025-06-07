import express from "express"
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js"
import { createQuiz, evaluate, getAttempted, getPending, getQuestions, getResults, quizMain, saveResponse, startAttempt, test} from "../controllers/quiz.controller.js"
const quizRouter = express.Router()

quizRouter.get("/",isLoggedIn, quizMain)
quizRouter.post("/", isLoggedIn, createQuiz)
quizRouter.post("/attempt", isLoggedIn, startAttempt) 
quizRouter.get("/questions", isLoggedIn, getQuestions)
quizRouter.get("/pending", isLoggedIn, getPending)
quizRouter.post("/submit-response", isLoggedIn, saveResponse)
quizRouter.get("/evaluate", isLoggedIn, evaluate)
quizRouter.get("/result/:quizAttemptId", isLoggedIn, getResults)
quizRouter.get("/attempted", isLoggedIn, getAttempted)
quizRouter.get("/test", isLoggedIn, test)

export default quizRouter;