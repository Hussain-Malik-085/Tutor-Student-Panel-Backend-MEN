
const Users = require('../Models/Users');
const UserProfiles = require('../Models/teacherModels/UserProfiles');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin'); 
require('dotenv').config();
const fs = require('fs');
const path = require('path');

//---------------------------------------------------------//

// User Registration Controller Basically Signup
let usersInsert = async (req , res) => {

let {Username, Email, Password}=req.body;
// Frontend se body me email (ya username) aur password aayega
        
// Database me user dhoondo
    const existingUser = await Users.findOne({
      $or: [
        { Email: Email },
        { Username: Email }
      ]
    });

    if (existingUser) {
      return res.status(404).json({ status: 0, message: "User already Exists" });
    }

  // Password hash karo
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    //console.log(sName,sEmail,sPhone,sMessege);
   let user = new Users ({
Username: Username,
Email: Email,
Password: hashedPassword
   })


user.save().then(() => {

console.log("Data saved in MongoDB Now user has been registered Successfully");
res.send({status: 1, Messege: "Data saved in Mongo" })

}).catch ((err) =>{

console.log(err);
res.send({status: 0, Messege: "Data not saved in Mongo",error:err});

})
}

//---------------------------------------------------------//

// Login controller
let userLogin = async (req, res) => {
  try {
    // Frontend se body me email (ya username) aur password aayega
    const { email, password } = req.body;

    // Database me user dhoondo
    const user = await Users.findOne({
      $or: [
        { Email: email },
        { Username: email }
      ]
    });

    if (!user) {
      return res.status(404).json({ status: 0, message: "User not found" });
      //throw new ApiError(404, "User does not exist");
    }

    // Ab hashed password compare karo
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ status: 0, message: "Password not match" });
    }
    // Password match ho gaya, JWT token generate karo
let token = jwt.sign({id: user._id, email: user.Email },  process.env.JWT_SECRET,{ expiresIn: '7d' });
    console.log(token);
    res.cookie("token", token, {httpOnly: true});
    console.log("Cookie Set");
    // Login successful, user details bhejo (password hata ke)

  res.status(200).json({
  status: 1,
  message: "Login successful",
  token: token,
  data: {
    _id: user._id,
    Username: user.Username,
    Email: user.Email
  }


  
});
  } catch (err) {
    res.status(500).json({ status: 0, message: "Server error", error: err.message });
  }
};

//---------------------------------------------------------//

//Firebase login controller
let firebaseLogin = async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split(" ")[1];
    if (!idToken) {
      return res.status(401).json({ status: 0, message: "No Firebase token provided" });
    }

    // Step 1: Firebase se verify karo
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Step 2: MongoDB me user find/update
    let user = await Users.findOne({ Email: decoded.email });

    if (!user) {
      user = new Users({
        Username: decoded.name || decoded.email.split("@")[0],
        Email: decoded.email,
        firebaseUid: decoded.uid,
        provider: "google",
        photoURL: decoded.picture
      });
      await user.save();
    } else {
      // Update existing user with Firebase info if needed
      user.lastLogin = new Date();
      if (!user.firebaseUid) {
        user.firebaseUid = decoded.uid;
        user.provider = "google";
      }
      if (decoded.picture && !user.photoURL) {
        user.photoURL = decoded.picture;
      }
      await user.save();
    }

    // Step 3: Apna JWT generate karo
    const token = jwt.sign(
      { id: user._id, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    console.log("Firebase login token:", token);
    res.cookie("token", token, {httpOnly: true});
    console.log("Cookie Set for Firebase user");

    res.json({
      status: 1,
      message: "Firebase login successful",
      token,
      data: {
        _id: user._id,
        Username: user.Username,
        Email: user.Email,
        provider: user.provider,
        photoURL: user.photoURL
      }
    });
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(401).json({ status: 0, message: "Invalid Firebase token", error: err.message });
  }
};





//---------------------------------------------------------//

module.exports = {
    usersInsert,
    userLogin,
    firebaseLogin
}