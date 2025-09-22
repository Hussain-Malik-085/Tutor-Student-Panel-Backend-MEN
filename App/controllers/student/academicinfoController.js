

//const Users = require('../Models/Users');
const AcademicData = require('../../Models/studentModels/AcademicInfo');

require('dotenv').config();
const fs = require('fs');
const path = require('path');




let AcademicInfoProfile  = async (req, res) => {
  try {
    let { Grade , Year , PrefferedSubjects , Interests } = req.body;
    
    // yahan assume karo JWT se tumne user ka _id nikal liya hai
    let UserId = req.user.id;  // req.user me JWT middleware se user info aayega

    //console.log(sName,sEmail,sPhone,sMessege);
   let academicdata = await AcademicData.findOneAndUpdate(
   { userId: UserId}, 
   {grade: Grade,
year: Year,
prefferedsubjects: PrefferedSubjects, 
interests: Interests
   },   
{ new: true, upsert: true } // agar profile nahi hai to naya create kar do
   )

console.log("Your Academic Data Saved Successfully");
res.send({status: 1, Messege: "AcademicData Saved Successfully", data: academicdata });
} catch (err) {

console.log(err);
res.send({status: 0, Messege: "About us Data not saved",error:err});

}};  


//---------------------------------------------------------// 


// GET Profile Controller - JWT auth required
let getAcademicInfoProfile = async (req, res) => {
  try {
    // JWT middleware se user ID nikalo
    let userId = req.user.id;  // auth middleware se aayega
    
    console.log("Fetching Academicinfo screen data for userId:", userId);
    
    // UserProfiles collection se data find karo
    let academicdata = await AcademicData.findOne({ userId: userId });
    
  
    if (!academicdata) {
      return res.send({
        status: 0, 
        message: "Academic Info Not Found", 
        data: null
      });
    }
    
    // Profile mili to response bhejo
    console.log("Academic Info Found:", academicdata);
    
    // Frontend ke format ke according response bhejo
    let responseData = {
      Grade: academicdata.grade || "",
      Year: academicdata.year|| "",
      PrefferedSubjects: academicdata.prefferedsubjects && academicdata.prefferedsubjects.length > 0 ? academicdata.prefferedsubjects[0] : "",// empty strings remove karo
       Interests: academicdata.interests.filter(subj => subj.trim() !== "") || [],     // empty strings remove karo
      
      
    };
    
    console.log("Sending response to frontend:", responseData);
    
    res.send({
      status: 1,
      message: "Acaademic Info Data retrieved successfully",
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
   
 
   AcademicInfoProfile,
    getAcademicInfoProfile
  
}


    