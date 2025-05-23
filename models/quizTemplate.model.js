import mongoose from "mongoose";

const quizTemplates = new mongoose.Schema({

        // Basic Information
        topic: String,
        category: String,
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"]
        }, 
        description: String,
        
        // Question references with order
        questions: [{
          questionId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Questions"
            },
          order: Number, // For maintaining question sequence
          points: Number // Allow per-quiz point overrides
        }],
        
        // Quiz Configuration
        settings: {
          timeLimit: Number,
          allowRetakes: Boolean,
          maxAttempts: Number,
          shuffleQuestions: Boolean,
          shuffleOptions: Boolean,
          showResultsImmediately: Boolean,
          passingScore: Number
        },
        
        // Template metadata
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        isPublished: Boolean,
        version: Number,
        createdAt: Date,
        updatedAt: Date
      }
,{
  timestamps: true
})

const QuizTemplate = mongoose.model("QuizTemplates", quizTemplates);

export default QuizTemplate;