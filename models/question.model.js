import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
  question: String,
  options: [{
    number: Number,
    content: String,
    isCorrect: Boolean // Single source of truth && we don't pass it to the user
  }],
  type: {
    type: String,
    enum: ["mcq", "msq", "text", "boolean"],
    required: true
  },
  points: Number,
  tags: [String],
  
  // Additional useful fields:
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true
  },
  category: String,
  isActive: Boolean,
}, {
  timestamps: true
})


const Question = mongoose.model("Questions", questionSchema)

export default Question;