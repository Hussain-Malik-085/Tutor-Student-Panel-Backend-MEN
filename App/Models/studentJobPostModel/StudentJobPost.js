// Models/studentJobPostModel/StudentJobPost.js
const mongoose = require("mongoose");

const JobPostSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
   jobType: {
  type: String,
  enum: ["Onsite", "Remote", "Hybrid"], 
  required: true,
},
    jobLocation: {
      type: String,
      required: true,
    },
    interests: {
      type: [String],   // array of skills/subjects
      default: [],
    },
    experience: {
      type: String,     // you can use Number if it's always numeric
      required: true,
    },
    details: {
      type: String,
      required: true,
      maxlength: 1000,  // optional limit
    },
     student:  {
      type: mongoose.Schema.Types.ObjectId,
    ref: "StudentBasicInfo",
    required: true,
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

module.exports = mongoose.model("StudentJobPost", JobPostSchema);
