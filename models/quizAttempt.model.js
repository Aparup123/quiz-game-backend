import mongoose from "mongoose";

const quizAttempts = new mongoose.Schema({
    // References
  quizTemplateId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "QuizTemplates"
    },
  userId: {
    type:mongoose.Schema.TypesObjectId,
    ref: "User"
    },
  attemptNumber: Number,
  
  // User responses
  responses: [{
    questionId: {
        type: mongoose.Schema.TypesObjectId, 
        ref: "Questions"
    },
    selectedOptionIds: [Number],
    textAnswer: String, // For text-type questions
    answeredAt: Date,
    timeSpent: Number
  }],
  
  // Computed results (calculated after submission)
  results: [{
    questionId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Questions"
    },
    selectedOptionIds: [Number],
    correctOptionIds: [Number], // Computed from Questions.options.isCorrect
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
    enum: ["in_progress", "completed", "submitted", "abandoned"],
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
  ipAddress: String,
  userAgent: String,
  sessionId: String,
  
},{
  timestamps: true
})

const QuizAttempt = mongoose.model("QuizAttempts", quizAttempts);

export default QuizAttempt;