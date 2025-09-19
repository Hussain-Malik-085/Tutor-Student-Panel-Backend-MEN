


let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    Username: {
        type: String,
        required: false // bas display ke liye, unique nahi
    },
    Email: {
        type: String,
        required: true,
        unique: true // Email se hi login + identity fix hogi
    },
    Password: {
        type: String,
        required: false // Firebase users ke liye zaroori nahi
    },
    firebaseUid: {
        type: String,
        required: false,
        unique: true,
        sparse: true // sirf Firebase users ke liye hoga
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    role: { 
        type: String, 
        enum: ["student", "tutor"],
        default: "student" },
  
    photoURL: {
        type: String
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

let UserModel = mongoose.model('Users', UserSchema);
module.exports = UserModel;