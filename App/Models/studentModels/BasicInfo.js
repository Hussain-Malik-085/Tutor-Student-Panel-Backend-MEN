const mongoose = require("mongoose");

const BasicInfoSchema = new mongoose.Schema({
    userId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  age: { type: String, required: true },
  photoURL: {
        type: String,
        required: false,
        trim : true 
    },
  dob: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("StudentBasicInfo", BasicInfoSchema );


 