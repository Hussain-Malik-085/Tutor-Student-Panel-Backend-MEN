
const Users = require('../../Models/Users');
const UserProfiles = require('../../Models/UserProfiles');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
let token = jwt.sign({id: user._id, email: user.Email },  process.env.JWT_SECRET,{ expiresIn: '1h' });
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

// Create your profile api after login CREATE PROFILE SCREEN
let userProfile = async (req, res) => {
  try {
    let { Phone, Experience, Country, Location, Language, Subject } = req.body;
    // Frontend se body me USer ka data aarha ha profile create ka

 // yahan assume karo JWT se tumne user ka _id nikal liya hai
    let UserId = req.user.id;  // req.user me JWT middleware se user info aayega

    //console.log(sName,sEmail,sPhone,sMessege);
   let profile = await UserProfiles.findOneAndUpdate(
   { userId: UserId}, 
   {phoneNumber: Phone,
experience: Experience,
country: Country,
location: Location,
language: Language,
subject: Subject}, 
{ new: true, upsert: true } // agar profile nahi hai to naya create kar do
   )

console.log("data saved/Updated");
res.send({status: 1, Messege: "About us Data Saved Successfully", data: profile });
} catch (err) {

console.log(err);
res.send({status: 0, Messege: "About us Data not saved",error:err});

}};  


//---------------------------------------------------------// 


// GET Profile Controller - JWT auth required
let getProfile = async (req, res) => {
  try {
    // JWT middleware se user ID nikalo
    let userId = req.user.id;  // auth middleware se aayega
    
    console.log("Fetching profile for userId:", userId);
    
    // UserProfiles collection se data find karo
    let profile = await UserProfiles.findOne({ userId: userId });
    
    // Agar profile nahi mili
    if (!profile) {
      return res.send({
        status: 0, 
        message: "Profile not found", 
        data: null
      });
    }
    
    // Profile mili to response bhejo
    console.log("Profile found:", profile);
    
    // Frontend ke format ke according response bhejo
    let responseData = {
      Phone: profile.phoneNumber || "",
      Experience: profile.experience || "",
      Country: profile.country || "Pakistan",  // default Pakistan
      Location: profile.location || "",
      Language: profile.language.filter(lang => lang.trim() !== "") || [],  // empty strings remove karo
      Subject: profile.subject.filter(subj => subj.trim() !== "") || [],     // empty strings remove karo
      Picture: profile.picture || ""  // picture field add kiya
      
    };
    
    console.log("Sending response to frontend:", responseData);
    
    res.send({
      status: 1,
      message: "Profile retrieved successfully",
      data: responseData
    });
    
  } catch (err) {
    console.log("Error fetching profile:", err);
    res.send({
      status: 0,
      message: "Error retrieving profile",
      error: err.message
    });
  }
};




//---------------------------------------------------------// 

// Upload Profile Picture Controller - JWT auth required
let uploadProfilePicture = async (req, res) => {
    try {
       // const photopath = req.file ? req.file.path : null;
        let UserId = req.user.id;
        // New: Relative path banao (education wale tarah)
        let photopath = null;
        if (req.file) {
            photopath = `uploads/${req.file.filename}`;  // Relative path for DB
            console.log("Generated relative path for profile:", photopath);
        // 1️⃣ Check if user already has a profile
        let existingProfile = await UserProfiles.findOne({ userId: UserId });

        // 2️⃣ If old picture exists, delete it from uploads
        if (existingProfile && existingProfile.picture) {
          // Convert old relative/full path to full absolute path
                const oldFilename = path.basename(existingProfile.picture);  // Sirf filename extract
                const fullOldPath = path.join(__dirname, '..', '..', '..', 'uploads', oldFilename);  // Extra '..' for App folder (tumhare structure pe adjust)
                
                console.log("Attempting to delete old profile pic at:", fullOldPath);  // Optional debug
            fs.unlink(fullOldPath, (err) => {
                if (err) console.log("Error deleting old image:", err.message);
                else console.log("Old image deleted:", fullOldPath);
            });
        }

        // 3️⃣ Update profile with new picture
        let profile = await UserProfiles.findOneAndUpdate(
            { userId: UserId },
            { picture: photopath },
            { new: true, upsert: true }
        );
       console.log("New Picture Added:", profile.picture);
        // Generate full URL for response
        const fullPictureUrl = `http://127.0.0.1:8020/${photopath}`;
        
        res.json({ 
            status: 1,
            message: "Profile Picture Uploaded successfully",
            data: profile,
            pictureUrl: fullPictureUrl,
            picture: photopath
        });
    } }
    catch (err) {
       console.log("Upload error:", err);
        res.status(500).json({
            status: 0,
            message: "Error uploading picture",
            error: err.message
        });
    }
};


//---------------------------------------------------------//


// Get Profile Picture Controller - JWT auth required
const getProfilePic = async (req, res) => {
  try {
    let userId = req.user.id;
    let profile = await UserProfiles.findOne({ userId: userId });
    
    if (!profile) {
      return res.json({ status: 0, message: "No profile found", data: null });
    }
    
    let fullPictureUrl = "";
    if (profile.picture) {
      let cleanPath = profile.picture.replace(/^\/+/, '');
      fullPictureUrl = `http://127.0.0.1:8020/${cleanPath}`;
    }
      console.log("Retrieved profile picture URL:", fullPictureUrl);
    res.json({
      status: 1,
      message: "Profile retrieved successfully",
      data: {
        picture: profile.picture || "",
        pictureUrl: fullPictureUrl
      }
    });
  } catch (err) {
    console.log("Get profile error:", err);
    res.status(500).json({ status: 0, message: "Error fetching profile", error: err.message });
  }
};

//---------------------------------------------------------//


module.exports = {
    usersInsert,
    userLogin   ,
    userProfile,
    uploadProfilePicture,
    getProfile,
    getProfilePic
}