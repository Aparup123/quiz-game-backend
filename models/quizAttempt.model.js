import mongoose from "mongoose";

const quizAttempts = new mongoose.Schema({
    // References
  quizTemplateId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "QuizTemplates"
    },
  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "Users"
    },
  attemptNumber: Number,
  
  // User responses
  responses: [{
    order: Number, // For maintaining question sequence
    question: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Questions",
        _id: false // Do not include _id in the question reference
    },
    selectedOptions: [Number],
    textAnswer: String, // For text-type questions
    // answeredAt: Date,
    // timeSpent: Number
  }],
  
  // Computed results (calculated after submission)
  results: [{
    order: Number, // For maintaining question sequence
    question: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Questions"
    },
    selectedOptions: [Number],
    pointsEarned: Number,
    pointsPossible: Number,
    status: {
      type: String,
      enum: ["correct", "incorrect", "partial", "notAttempted"],
      default: "notAttempted"
    }
  }],
  
  // Attempt metadata
  status: {
    type: String,
    enum: ["in_progress", "completed", "evaluated", "abandoned"],
    default: "in_progress"
  },
  
  // Scoring
  score: {
    obtained: Number,
    total: Number,
    percentage: Number,
    passed: Boolean
  },
  
  // Timing
  startedAt: Date,
  completedAt: Date,
  timeSpent: Number,
  
  // Session info
  // ipAddress: String,
  // userAgent: String,
  // sessionId: String,
  
},{
  timestamps: true
})

const QuizAttempt = mongoose.model("QuizAttempts", quizAttempts);

export default QuizAttempt;