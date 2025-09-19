const Basicinfo = require('../../Models/studentModels/BasicInfo');
//const jwt = require('jsonwebtoken');

// Create your profile api after login CREATE PROFILE SCREEN
let BasicInfoController = async (req, res) => {
  try {
    let { Username, Email, PhoneNumber, Age, DOB } = req.body;
    // Frontend se body me USer ka data aarha ha profile create ka

 // yahan assume karo JWT se tumne user ka _id nikal liya hai
    let UserId = req.user.id;  // req.user me JWT middleware se user info aayega

    //console.log(sName,sEmail,sPhone,sMessege);
   let profile = await Basicinfo.findOneAndUpdate(
   { userId: UserId}, 
   {username: Username,
email: Email,
phoneNumber: PhoneNumber,
age: Age,
dob: DOB}, 
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
let GetBasicInfoController = async (req, res) => {
  try {
    // JWT middleware se user ID nikalo
    let userId = req.user.id;  // auth middleware se aayega
    
    console.log("Fetching profile for userId:", userId);
    
    // UserProfiles collection se data find karo
    let profile = await Basicinfo.findOne({ userId: userId });
    
    // Agar profile nahi mili
    if (!profile) {
      return res.send({
        status: 0, 
        message: "Profile Data not found", 
        data: null
      });
    }
    
    // Profile mili to response bhejo
    console.log("Basic Info Found:", profile);
    
    // Frontend ke format ke according response bhejo
    let responseData = {
      Username: profile.username || "",
      Email: profile.email || "",
      Phone: profile.phoneNumber || "",
      Age: profile.age || "",
      DOB: profile.dob || "",   
    
      
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
module.exports = {
    BasicInfoController,
    GetBasicInfoController
}