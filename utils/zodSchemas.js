import { z } from "zod";
const signInSchema=z.object({
    email:z.string().min(1, "email is required").email("Invalid email format").describe("The email of the user"),
    password:z.string().min(1, "Password is required").describe("The password of the user"),
})

const signUpSchema=z.object({
    name: z.string().min(1, "Name is required").describe("The name of the user"),
    email: z.string().min(1, "Email is required").email("Invalid email format").describe("The email of the user"),
    password: z.string().min(1, "Password is required").describe("The password of the user"),
});


const createQuizSchema = z.object({
    topic: z.string().min(1, "Topic is required").describe("The topic of the quiz"),
    difficulty: z.number().min(0, "difficulty should be between 0 and 10").max(10, "difficulty should be between 0 and 10").describe("The difficulty level of the quiz"),
    numberOfQuestions: z.number().min(1, "Number of questions should be at least 1").describe("The number of questions in the quiz"),
    totalPoints: z.number().min(1, "Total points should be at least 1").describe("The total points for the quiz"),
    type: z.enum(["mcq", "msq", "boolean", "misc"]).describe("The type of the questions in the quiz"),
});

const startAttemptSchema = z.object({
    quizTemplateId: z.string().min(1, "Quiz Template Id is required").describe("The ID of the quiz template to start an attempt"),
});

const getQuestionsSchema = z.object({
    quizTemplateId: z.string().min(1, "Quiz Template Id is required").describe("The ID of the quiz template to get questions for"),
});

const saveResponseSchema = z.object({
    quizAttemptId: z.string().min(1, "Quiz Attempt Id is required").describe("The ID of the quiz attempt"),
    responses: z.array(z.object({
            order: z.number().min(1, "Order is required").describe("The order of the question in the quiz"),
            question: z.string().min(1, "Question ID is required").describe("The ID of the question"),
            selectedOptions: z.array(z.number()).min(1, "At least one option must be selected").describe("The selected options for the question"),        
    }))
});



export {signInSchema, signUpSchema, createQuizSchema, startAttemptSchema, saveResponseSchema, getQuestionsSchema}