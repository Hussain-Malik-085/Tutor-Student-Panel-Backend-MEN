
const UserProfiles = require('../../Models/UserProfiles');

const EducationData = require('../../Models/EducationData');


const fs = require('fs');




// Create your profile api after login CREATE PROFILE SCREEN
let EducationReceive = async (req, res) => {
  try {
    let { University, Degree, Specialization, StartDate, EndDate, CertificateUrl } = req.body;
    // Frontend se body me USer ka data aarha ha profile create ka

 // yahan assume karo JWT se tumne user ka _id nikal liya hai
    let UserId = req.user.id;  // req.user me JWT middleware se user info aayega

    //console.log(sName,sEmail,sPhone,sMessege);
   let EducationSend  = await EducationData.findOneAndUpdate(
   { userId: UserId}, 
   {university: University,
    degree: Degree,
    specialization: Specialization,
    startDate: StartDate,
    endDate: EndDate,
    //certificateUrl: CertificateUrl
   },
   { new: true, upsert: true } // agar profile nahi hai to naya create kar do
   )



console.log("Education Data Saved in MongoDB Successfully");
res.send({status: 1, Messege: "Education Data Saved Successfully", data: EducationSend });
} catch (err) {

console.log(err);
res.send({status: 0, Messege: "Education Data not saved",error:err});

}};  

module.exports = {
    EducationReceive,
    
}