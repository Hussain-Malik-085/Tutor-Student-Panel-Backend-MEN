let mongoose = require('mongoose');

const descriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",   // yahan Users schema ka naam dena hai
    required: true
  },
  introduction: {
    type: String,
    required: true,
    trim: true,
  },
  teaching: {
    type: String,
    required: true,
    trim: true,
  },
  motivation: {
    type: String,
    required: true,
    trim: true,
  },
  headline: {
    type: String,
    required: true,
    trim: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let DescriptionModel = mongoose.model('Description', descriptionSchema);
module.exports = DescriptionModel;





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
