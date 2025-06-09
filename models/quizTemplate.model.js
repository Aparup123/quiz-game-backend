import mongoose from "mongoose";

const quizTemplates = new mongoose.Schema({

        // Basic Information
        topic: String,
        difficulty:Number,
        description: String,
        duration:String,
        numberOfQuestions:Number,
        totalPoints:Number,
        type: {
            type: String,
            enum: ["mcq", "msq", "boolean", "misc"],
            default: "mcq" // Default type is multiple choice questions
        },
        // Question references with order
        questions: [{
          question: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Questions"
            },
          order: Number, // For maintaining question sequence
          points: Number, // Allow per-quiz point overrides
          _id: false // Disable auto-generated _id for this subdocument
        }],
        pending: Boolean, // Indicates if the quiz is pending or completed
        
        // // Quiz Configuration
        // settings: {
        //   timeLimit: Number,
        //   allowRetakes: Boolean,
        //   maxAttempts: Number,
        //   shuffleQuestions: Boolean,
        //   shuffleOptions: Boolean,
        //   showResultsImmediately: Boolean,
        //   passingScore: Number
        // },
        
        // Template metadata
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
      }
,{
  timestamps: true
})

const QuizTemplate = mongoose.model("QuizTemplates", quizTemplates);

export default QuizTemplate;