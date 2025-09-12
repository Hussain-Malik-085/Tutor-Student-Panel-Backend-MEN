

const EducationData = require('../../Models/EducationData');


const fs = require('fs');
const path = require('path');



// Create your profile api after login EDUCATION  PROFILE SCREEN


// // Create / Update Education + Certificate
// let EducationReceive = async (req, res) => {
//   try {
//     let { University, Degree, Specialization, StartDate, EndDate } = req.body;
//     let UserId = req.user.id; // JWT middleware se user info
    
    
//     const photopath = req.file ? req.file.path : null;

//     // 1️⃣ Education fields update karo (without certificate)
//     let EducationSend = await EducationData.findOneAndUpdate(
//       { userId: UserId },
//       {
//         university: University,
//         degree: Degree,
//         specialization: Specialization,
//         startDate: StartDate,
//         endDate: EndDate,
//       },
//       { new: true, upsert: true }
//     );

//     // 2️⃣ Agar file aayi hai to old certificate delete + new update
//     let updatedCertificate = null;
//     if (photopath) {
//       let existingProfile = await EducationData.findOne({ userId: UserId });

//       if (existingProfile && existingProfile.certificateUrl) {
//         fs.unlink(existingProfile.certificateUrl, (err) => {
//           if (err) console.log("Error deleting old certificate:", err);
//           else console.log("Old certificate deleted:", existingProfile.certificateUrl);
//         });
//       }

//       let profile = await EducationData.findOneAndUpdate(
//         { userId: UserId },
//         { certificateUrl: photopath },
//         { new: true }
//       );

//       updatedCertificate = profile.certificateUrl;
//       console.log("New Certificate Added:", updatedCertificate);
//     }

//     console.log("Profile & Education Data Saved Successfully in MongoDB");

//     res.json({
//       status: 1,
//       message: "Education Data Saved Successfully",
//       data: EducationSend,
//       certificateUrl: updatedCertificate,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       status: 0,
//       message: "Error saving profile",
//       error: err,
//     });
//   }
// };

//const path = require('path'); // Ensure path module imported

let EducationReceive = async (req, res) => {
  try {
    let { University, Degree, Specialization, StartDate, EndDate } = req.body;
    let UserId = req.user.id;

    // New: Relative path for certificate
    let photopath = null;

    if (req.file) {
      // Extract only the relative path (uploads/filename.jpg)
      photopath = `uploads/${req.file.filename}`; // Use filename instead of path
      console.log("Generated relative path:", photopath);

      // Delete old certificate if exists
      let existingProfile = await EducationData.findOne({ userId: UserId });
      if (existingProfile && existingProfile.certificateUrl) {
        // Convert old relative path to full path for deletion
        const fullOldPath = path.join(__dirname, '..', '..', '..', 'uploads', path.basename(existingProfile.certificateUrl));
        fs.unlink(fullOldPath, (err) => {
          if (err) console.log("Error deleting old certificate:", err.message);
          else console.log("Old certificate deleted successfully:", fullOldPath);
        });
      }

      // Update certificateUrl with relative path
      await EducationData.findOneAndUpdate(
        { userId: UserId },
        { certificateUrl: photopath },
        { new: true }
      );
    updatedCertificate = photopath;
  console.log("New Certificate Added:", updatedCertificate);
}

    // Update education fields
    let EducationSend = await EducationData.findOneAndUpdate(
      { userId: UserId },
      {
        university: University,
        degree: Degree,
        specialization: Specialization,
        startDate: StartDate,
        endDate: EndDate,
      },
      { new: true, upsert: true }
    );

    console.log("Profile & Education Data Saved Successfully in MongoDB");

    // Return full URL for frontend
    const fullCertificateUrl = photopath ? `http://127.0.0.1:8020/${photopath}` : null;

    res.json({
      status: 1,
      message: "Education Data Saved Successfully",
      data: EducationSend,
      certificateUrl: fullCertificateUrl, // Send full URL to frontend
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 0,
      message: "Error saving profile",
      error: err.message,
    });
  }
};
// --------------------------------------------------------- //



// GET Education Data Controller - JWT auth required
const getEducationData = async (req, res) => {
  try {
    // JWT middleware se user ID nikalo
    let userId = req.user.id;  // auth middleware se aayega
    
    console.log("Fetching education data for userId:", userId);
    
    // EducationData collection se data find karo
    let educationData = await EducationData.findOne({ userId: userId });
    
    // Agar education data nahi mili
    if (!educationData) {
      return res.send({
        status: 0, 
        message: "Education data not found", 
        data: null
      });
    }
    
    // Education data mili to response bhejo
    console.log("Education data found:", educationData);
    
    // Certificate URL ko full path banao (agar hai to)
    // Certificate URL ko full path banao (agar hai to)
let fullCertificateUrl = "";
if (educationData.certificateUrl) {
  // Double slash avoid karne ke liye trim karo aur 127.0.0.1 use karo
  let cleanPath = educationData.certificateUrl.replace(/^\//, '');  // Leading slash remove if double
  fullCertificateUrl = `http://127.0.0.1:8020/${cleanPath}`;
  console.log("Certificate URL created:", fullCertificateUrl);
}
    
    // Frontend ke format ke according response bhejo
    let responseData = {
      University: educationData.university || "",
      Degree: educationData.degree || "",
      Specialization: educationData.specialization || "",
      StartDate: educationData.startDate,
      EndDate: educationData.endDate,
      CertificateUrl: fullCertificateUrl,  // Complete URL with server path
      CreatedAt: educationData.createdAt
    };
    
    console.log("Sending education response to frontend:", responseData);
    
    res.send({
      status: 1,
      message: "Education data retrieved successfully",
      data: responseData
    });
    
  } catch (err) {
    console.log("Error fetching education data:", err);
    res.send({
      status: 0,
      message: "Error retrieving education data",
      error: err.message
    });
  }
};


// --------------------------------------------------------- //


module.exports = {
  EducationReceive,  // existing create/update function
  getEducationData   // new get function
};



// --------------------------------------------------------- //