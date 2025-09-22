const mongoose = require("mongoose");

const AcademicInfoSchema = new mongoose.Schema({

    userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "StudentBasicInfo",   // yahan Users schema ka naam dena hai
       required: true
     },

     grade: 
     { type: String, 
        required: true },

     year :
      { type: String,
         required: true },

     prefferedsubjects: {  // ✅ Double 'f' kar do consistent rakhne ke liye
    type: [String],
    default: [],
  },

    
     interests: {
      type: [String], // multiple interests as array of strings
      default: [],
    
    },},
   { timestamps: true });

  

module.exports = mongoose.model("StudentAcademicInfo", AcademicInfoSchema );


