let mongoose = require('mongoose');
//let Schema = mongoose.Schema;


const educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",   // yahan Users schema ka naam dena hai
    required: true
  },
  university: {
    type: String,
    required: true,
    trim: true,
  },
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  specialization: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    
  },
  certificateUrl: {
    type: String, // file path ya cloud URL
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save hook for validation instead of field-level validation
educationSchema.pre('save', function(next) {
  // Only validate if both dates exist
  if (this.startDate && this.endDate) {
    // Use getTime() for accurate comparison
    if (this.endDate.getTime() < this.startDate.getTime()) {
      const error = new Error('End date cannot be earlier than start date');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});


let EducationModel = mongoose.model('TeacherEducation', educationSchema);
module.exports = EducationModel;





// Users collection me Example ka sath samjahya gya ha
//ye user id Users collection se is trah work kr rhi now as foreign key
// {
//   _id: 68b85aefb8c426c1c32bb805,
//   username: "My name",
//   email: "test@gmail.com"
// }

// // UserProfiles collection me
// {
//   _id: 76x92aefb8c456d1c39bb123,
//   userId: 68b85aefb8c426c1c32bb805,   // 👈 link to Users
//   phoneNumber: "03001234567",
//   language: ["English", "Urdu"]
// }
