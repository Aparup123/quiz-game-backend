import { ChatPromptTemplate } from "@langchain/core/prompts"
import model from "./model.js"
import {z} from "zod"

const questionSchema=z.object({
    question:z.string().describe("The question to be asked"),
    options:z.array(z.object({
        number:z.number().describe("The number of the option in the list"),
        content:z.string().describe("The text of the option"),
        isCorrect:z.boolean().describe("Whether the option is correct or not")
    })).describe("The options for the question"),
    tags:z.array(z.string()).describe("The tags for the question"),
    difficulty:z.number().min(1).max(10).describe("The difficulty of the question"),
    // mcq msq boolean
    type:z.enum(["mcq", "msq", "boolean", "misc"]).describe("The type of the question"),
    points:z.number().describe("The point for the question"),
})

const responseSchema=z.object({
    questions:z.array(questionSchema).describe("The list of questions"),
})



const llm=model.withStructuredOutput(responseSchema)

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `You are a quiz game assistant.
        You will generate {numberOfQuestions} questions on topic with difficulty (difficulty ranges from 0 to 10) entered by the user.
        and the total points for the quiz will also be given as input.
        Divide the total points to the questions based on the difficulty of the questions.
        The questions should be of type which is given as input.
        If the type is "misc", questions will be of type mcq, msq and boolean mixed.
        `],
    ["human", "difficulty:{difficulty}, topic:{topic}, totalPoints:{totalPoints}, type:{type}"],
])

const generateQuestions = async (topic, difficulty, numberOfQuestions, totalPoints, type) => {
    const prompt = await promptTemplate.invoke(
        {
            topic:topic,
            difficulty:difficulty,
            numberOfQuestions:numberOfQuestions,
            totalPoints:totalPoints,
            type:type
        }
    )

    const response=await llm.invoke(prompt)
    return response.questions
}

export {generateQuestions};