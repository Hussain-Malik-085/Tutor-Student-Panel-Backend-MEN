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


let UserProfileModel = mongoose.model('UserProfiles', userProfileSchema);
module.exports = UserProfileModel;






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
