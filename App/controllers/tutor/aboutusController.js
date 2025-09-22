

//const Users = require('../Models/Users');
const UserProfiles = require('../../Models/teacherModels/AboutUsData');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin'); // ✅ Add this import
require('dotenv').config();
const fs = require('fs');
const path = require('path');



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
module.exports = {
   
 
    userProfile,
    getProfile
  
}