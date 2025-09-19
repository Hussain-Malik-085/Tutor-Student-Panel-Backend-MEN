


//const Users = require('../Models/Users');
const UserProfiles = require('../../Models/teacherModels/UserProfiles');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin'); // ✅ Add this import
require('dotenv').config();
const fs = require('fs');
const path = require('path');


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
   
    uploadProfilePicture,
    getProfilePic,
  
}