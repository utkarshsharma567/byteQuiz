import mongoose from 'mongoose';

const performanceEnum = ["Excellent", "Good", "Average", "Needs Work"];

const resultSchema = new mongoose.Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId, // यह फ़ील्ड MongoDB ObjectId टाइप का होगा (यूज़र का ID स्टोर करने के लिए)
    ref: 'User',                           // यह बताता है कि यह 'User' collection को रेफ़र करता है
    required: false                         // यह फ़ील्ड ज़रूरी है, बिना इसे डॉक्यूमेंट सेव नहीं होगा
},
title:{
    type:String,
    required:true,
    trim:true
},
 technology: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "html",
        "css",
        "js",
        "react",
        "node",
        "mongodb",
        "java",
        "python",
        "cpp",
        "bootstrap"
      ]
    },
    level: { type: String, required: true, enum: ["basic", "intermediate", "advanced"] },
    totalQuestions: { type: Number, required: true, min: 0 },
    correct: { type: Number, required: true, min: 0, default: 0 },
    wrong: { type: Number, required: true, min: 0, default: 0 },
    score: { type: Number, min: 0, max: 100, default: 0 },//percentage
    performance: { type: String, enum: performanceEnum, default: "Needs Work" },
},
  { timestamps: true }
);

//COMPUTE SCORE AND PERFORMANCE
resultSchema.pre('save', function () {
    const total = Number(this.totalQuestions) || 0;
    const correct = Number(this.correct) || 0;

    this.score = total ? Math.round((correct / total) * 100) : 0;

    if (this.score >= 85) this.performance = 'Excellent';
    else if (this.score >= 65) this.performance = 'Good';
    else if (this.score >= 45) this.performance = 'Average';
    else this.performance = 'Needs Work';

    if ((this.wrong === undefined || this.wrong === null) && total) {
        this.wrong = Math.max(0, total - correct);
    }
});
const Result = mongoose.model('Result',resultSchema);

export default Result;
