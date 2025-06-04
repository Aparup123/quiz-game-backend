import Question from "../models/question.model.js";
import QuizTemplate from "../models/quizTemplate.model.js";
import { generateQuestions } from "../llm/llm.js";
import { ApiError, ZodValidationError } from "../utils/apiClasses.util.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import { createQuizSchema, getQuestionsSchema, saveResponseSchema, startAttemptSchema } from "../utils/zodSchemas.js";
import { isSetEqual } from "../utils/helper.js";

const quizMain = (req, res, next) => {
    res.send("Quiz Route");
}

const createQuiz = async (req, res, next) => {
    try {
        //store the questions to the database and store the objectIds into an array
        //create a quiz template and store the objectIds into the questions array
        //createdBy will be the userId of the logged in user
        //store the quiz template into the database
        //return the quiz template
        const parsedData = createQuizSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new ZodValidationError(parsedData.error);
        }
        const { topic, difficulty, numberOfQuestions, totalPoints, type } = req.body;

        const questions = await generateQuestions(difficulty, topic, numberOfQuestions, totalPoints, type);
        if (!questions || questions.length === 0) {
            throw new ApiError("Failed to generate questions", 500);
        }
        const questionList = await Promise.all(questions.map(async (question, i) => {
            const points = question.points;
            delete question.points;
            const q = new Question(question);
            await q.save();
            const qObj = {
                question: q._id.toString(),
                order: i + 1,
                points: points
            }
            return qObj;

        }))

        const quizTemplate = new QuizTemplate({
            topic: topic,
            difficulty: difficulty,
            // description: "Quiz Description",
            questions: questionList,
            createdBy: req.user.id
        })
        await quizTemplate.save();
        if (!quizTemplate) {
            throw new ApiError("Failed to create quiz template", 500);
        }
        res.status(201).json({
            message: "Quiz Created Successfully",
            quizTemplate: quizTemplate
        });
    } catch (err) {
        next(err);
    }
}


const startAttempt = async (req, res, next) => {
    try {
        // create a quiz attempt document at the start of the attempt
        // with startedAt as the current date
        const parsedData = startAttemptSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new ZodValidationError(parsedData.error);
        }
        const { quizTemplateId } = req.body;
        const userId = req.user.id;
        const quizAttemptExists = await QuizAttempt.find({ quizTemplateId: quizTemplateId, userId: userId });
        let prevAttempts = 0;
        if (quizAttemptExists) {
            prevAttempts = quizAttemptExists.length
        }

        const quizAttempt = new QuizAttempt({
            quizTemplateId: quizTemplateId,
            userId: userId,
            startedAt: new Date(),
            status: "in_progress",
            attemptNumber: prevAttempts + 1,
        })
        await quizAttempt.save();
        res.status(201).json({
            message: "Quiz Attempt Started Successfully",
            quizAttempt: quizAttempt
        });
    } catch (err) {
        next(err);
    }
}

const getQuestions = async (req, res, next) => {
    try {
        const parsedData = getQuestionsSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new ZodValidationError(parsedData.error);
        }
        const { quizTemplateId } = req.body;
        const quiz = await QuizTemplate.findById(quizTemplateId).populate("questions.question");
        if (!quiz) {
            throw new ApiError("Quiz Template Not Found", 404);
        }
        const questions = quiz.questions.map(q => {
            const secureOptions = q.question.options.map((opt) => {
                return { number: opt.number, content: opt.content };
            })
            console.log(secureOptions);
            q.question.options = secureOptions;
            return q;
        });
        res.status(200).json({
            message: "Questions fetched successfully",
            questions: questions
        });
    }
    catch (err) {
        next(err);
    }

}


const saveResponse = async (req, res, next) => {
    // save the response of the user to the quiz attempt document
    // with the question ids, selected options, text answers
    // update the quiz attempt document with the response
    // also update the status of the quiz attempt document to in_progress
    try {
        const parsedData = saveResponseSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new ZodValidationError(parsedData.error);
        }
        const { responses, quizAttemptId } = req.body

        const quizAttempt = await QuizAttempt.findById(quizAttemptId)
        if (!quizAttempt) {
            throw new ApiError("Quiz Attempt Not Found", 404)
        }
        if (quizAttempt.status !== "in_progress") {
            throw new ApiError("Quiz Attempt is not in progress", 400);
        }

        // update the responses in the quiz attempt document
        quizAttempt.responses.push(...responses);
        quizAttempt.completedAt = new Date;
        quizAttempt.status = "completed";
        await quizAttempt.save();
        res.status(200).json({
            message: "Responses saved successfully",
            quizAttempt: quizAttempt
        });
    }
    catch (err) {
        next(err);
    }
}


const evaluate = async (req, res, next) => {
    try {
        // evaluate the quiz attempt and update the results
        // calculate the score, percentage, and status of each question
        // update the quiz attempt document with the results
        // return the results to the user
        const { quizAttemptId } = req.body;
        const attemptData = await QuizAttempt.findById(quizAttemptId).populate("score");
        
        const attempt = attemptData.toObject();
        if(!attempt){
            throw new ApiError("Quiz Attempt Not Found", 404);
        }
        if(attempt.status === "evaluated") {
            throw new ApiError("Quiz Attempt is already evaluated", 400);
        }
        if (attempt.status !== "completed") {
            throw new ApiError("Quiz Attempt is not submitted yet", 400);
        }
        console.log(attempt);
        const quizTemplate = await QuizTemplate.findById(attempt.quizTemplateId);
        const responses = attempt.responses;
        const questions = quizTemplate.questions;
        if (!quizTemplate) {
            throw new ApiError("Quiz Template Not Found", 404);
        }
        // if (attempt.status !== "completed") {
        //     throw new ApiError("Quiz Attempt is not completed", 400);
        // }
        let totalPoints = 0;
        let obtainedPoints = 0;
        const results = [];
        for(let q of questions) {
            const response = responses.find((r) => r.order === q.order);
            let res = null;
            let pointsEarned = 0;
            let isCorrect = false;
            if (!response) {
                res = {
                    order: q.order,
                    question: q.question,
                    selectedOptions: [],
                    pointsEarned: 0,
                    pointsPossible: q.points,
                    status: "notAttempted"
                }
            } else {
                const ques = await Question.findById(q.question);
                if (ques.type == "msq") {
                    // if the question type is msq, then multiple options can be selected
                    // check if all selected options are correct
                    const correctSet = new Set(ques.options.filter(o => o.isCorrect).map(o => o.number));
                    const selectedOptions = new Set(response.selectedOptions);
                    if (isSetEqual(correctSet, selectedOptions)) {
                        isCorrect = true
                    }
                } else {
                    // if the question type is not msq, then only one option is selected
                    const selectedOptionNumbers = response.selectedOptions[0];
                    if (ques.options.find(o => o.number == selectedOptionNumbers).isCorrect) {
                        isCorrect = true;
                    }
                }
                const pointsEarned = isCorrect ? q.points : 0;
                obtainedPoints += pointsEarned;
                res = {
                    order: q.order,
                    question: q.question,
                    selectedOptions: response.selectedOptions,
                    pointsEarned: pointsEarned,
                    pointsPossible: q.points,
                    status: isCorrect ? "correct" : "incorrect"
                }
            }

            totalPoints += q.points;
            results.push(res);

        }

        attempt.results = results;
        console.log(results);
        const score={
            obtained: obtainedPoints,
            total: totalPoints,
            percentage: (totalPoints / totalPoints) * 100
        }
        attempt.score = score;
        attempt.status= "evaluated";
        await QuizAttempt.findByIdAndUpdate(quizAttemptId, attempt);
        res.status(200).json({
            message: "Quiz Attempt Evaluated Successfully",
            results: results,
            score: {
                obtained: obtainedPoints,
                total: totalPoints,
                percentage: (obtainedPoints / totalPoints) * 100
            }
        });
    } catch (err) {
        next(err);
    }
}

const getResults=async(req, res, next)=>{
    const {quizAttemptId} = req.params;
    const attempt = await QuizAttempt.findById(quizAttemptId).populate("results.question");
    res.status(200).json({
        message: "Quiz Attempt Results Fetched Successfully",
        attempt: attempt
    });
}

const getAttempted=async (req, res, next)=>{
    // get all the quiz attempts of the user
    // return the quiz attempts with the quiz template details
    // return the quiz attempt details
    const userId = req.user.id;
    const attempts= await QuizAttempt.find({ userId: userId  , status: {$ne:"in_progress"} }).populate("quizTemplateId");
    if (!attempts || attempts.length === 0) {
        return res.status(404).json({
            message: "No quiz attempts found"
        }); 
    }
    res.status(200).json({
        message: "Quiz Attempts Fetched Successfully",
        attempts: attempts
    });
}

const test = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const quizzes = await QuizTemplate.find({ createdBy: userId })
        res.status(200).json({
            message: "Quizzes fetched successfully",
            quizzes: quizzes,
            numbers: quizzes.length
        });
    } catch (err) {
        next(err);
    }
}

export { quizMain, createQuiz, startAttempt, test, saveResponse, evaluate, getQuestions, getResults, getAttempted};
