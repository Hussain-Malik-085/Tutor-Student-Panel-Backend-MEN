let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",   // yahan Users schema ka naam dena hai
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  experience: {
    type: String,
    required: false,
    trim: true,
  },
  country: {
    type: String,
    required: false,
    trim: true
  },
  location: {
    type: String,
    required: false,
    trim: true
  },
  language: {
    type: [String],
    required: false,
    trim: true
  },
  subject: {
    type: [String] ,
    required: false,
    trim: true
  },
  picture: {
  type: String,
  required: false,
  trim: true
}
    
});


let UserProfileModel = mongoose.model('TeacherAboutUS', userProfileSchema);
module.exports = UserProfileModel;





