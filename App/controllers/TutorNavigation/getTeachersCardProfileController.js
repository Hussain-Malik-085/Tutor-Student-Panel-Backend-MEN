// controllers/teacherController.js
const Users = require("../../Models/Users");
const About = require("../../Models/teacherModels/AboutUsData")
const Education = require("../../Models/teacherModels/EducationData");
const Description = require("../../Models/teacherModels/DescriptionData")


let getTeachersCardProfileData = async (req, res) => {
  try {
    // Step 1: find only teachers
    const teachers = await Users.find({ role: "tutor" });

    // Step 2: merge data from other schemas
    const teacherProfiles = await Promise.all(
      teachers.map(async (tutor) => {
        const about = await About.findOne({ userId: tutor._id });
        const education = await Education.findOne({ userId: tutor._id });
        const description = await Description.findOne({ userId: tutor._id  });
        

        return {
          id: tutor._id,
          email: tutor.Email,
          name: tutor.Username || "",
         
          location: about?.location || "",
          language: about?.language || "",
          phone: about?.phoneNumber || "",
           experience: about?.experience || "",
           picture:about?.picture || "",

          degree: education?.degree || "",
          specialization: education?.specialization ||  "",
          university: education?.university || "",
          startDate:  education?.startDate || "",
           endDate:  education?.endDate || "",


           introduction: description?.introduction|| "",
        };
      })
    );

    res.json(teacherProfiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
};
module.exports = {
   
   getTeachersCardProfileData
  
}