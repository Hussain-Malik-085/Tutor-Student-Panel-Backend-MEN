const EducationData = require('../../Models/teacherModels/EducationData');
const fs = require('fs');
const path = require('path');


let EducationReceive = async (req, res) => {
  try {
    console.log("=== EDUCATION ENDPOINT HIT ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file ? "File exists" : "No file");
    
    let { University, Degree, Specialization, StartDate, EndDate } = req.body;
    let UserId = req.user.id;

    console.log("Extracted data:", {
      University,
      Degree, 
      Specialization,
      StartDate,
      EndDate,
      UserId
    });

    // Input validation
    if (!University || !Degree || !StartDate || !EndDate) {
      return res.status(400).json({
        status: 0,
        message: "University, Degree, Start Date, and End Date are required"
      });
    }

    // Date validation
    const startDateObj = new Date(StartDate);
    const endDateObj = new Date(EndDate);
    const today = new Date();
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({
        status: 0,
        message: "Invalid date format"
      });
    }

    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (startDateObj > todayStart) {
      return res.status(400).json({
        status: 0,
        message: "Start date cannot be in the future"
      });
    }


    if (endDateObj < startDateObj) {
      return res.status(400).json({
        status: 0,
        message: "End date cannot be earlier than start date"
      });
    }

    // Check existing data
    let existingEducation = await EducationData.findOne({ userId: UserId });
    console.log("Existing education:", existingEducation ? "Found" : "Not found");

    // Keep existing certificate URL by default
    let certificateUrl = existingEducation ? existingEducation.certificateUrl : null;

    // ONLY process new certificate if user actually uploaded a new file
    if (req.file) {
      console.log("New certificate file uploaded:", req.file.filename);
      
      // Generate new relative path
      let newCertificatePath = `uploads/${req.file.filename}`;
      console.log("Generated relative path:", newCertificatePath);

      // Delete old certificate ONLY if new one is uploaded and old one exists
      if (existingEducation && existingEducation.certificateUrl) {
        const oldFileName = path.basename(existingEducation.certificateUrl);
        const fullOldPath = path.join(__dirname, '..', '..', '..', 'uploads', oldFileName);
        
        console.log("Deleting old certificate:", fullOldPath);
        
        fs.unlink(fullOldPath, (err) => {
          if (err) {
            console.log("Error deleting old certificate:", err.message);
          } else {
            console.log("Old certificate deleted successfully:", fullOldPath);
          }
        });
      }

      // Set new certificate URL
      certificateUrl = newCertificatePath;
      console.log("New certificate URL set:", certificateUrl);
    } else {
      // No new file uploaded, keep existing certificate URL
      console.log("No new certificate uploaded, keeping existing URL:", certificateUrl);
    }

    // Prepare education data for save/update
    const educationUpdateData = {
      userId: UserId,
      university: University.trim(),
      degree: Degree.trim(),
      specialization: Specialization ? Specialization.trim() : "",
      startDate: StartDate,
      endDate: EndDate,
    };

    // ONLY update certificate URL if there's a certificate (new or existing)
    if (certificateUrl) {
      educationUpdateData.certificateUrl = certificateUrl;
    }

    console.log("Final data to save:", educationUpdateData);

    // Database operation
    let savedEducation;
    if (existingEducation) {
      console.log("Updating existing education...");
      savedEducation = await EducationData.findOneAndUpdate(
        { userId: UserId },
        { $set: educationUpdateData },
        { new: true, runValidators: true }
      );
    } else {
      console.log("Creating new education...");
      savedEducation = await EducationData.create(educationUpdateData);
    }

    if (!savedEducation) {
      console.log("❌ savedEducation is null/undefined");
      return res.status(500).json({
        status: 0,
        message: "Failed to save education data - no result from database"
      });
    }

    console.log("✅ Education saved successfully:", savedEducation._id);

    // Create full URL for frontend response
    const fullCertificateUrl = certificateUrl ? `http://127.0.0.1:8020/${certificateUrl}` : null;

    // Success response
    res.json({
      status: 1,
      message: existingEducation ? "Education Data Updated Successfully" : "Education Data Saved Successfully",
      data: {
        University: savedEducation.university,
        Degree: savedEducation.degree,
        Specialization: savedEducation.specialization,
        StartDate: savedEducation.startDate,
        EndDate: savedEducation.endDate,
        CertificateUrl: fullCertificateUrl,
        CreatedAt: savedEducation.createdAt
      }
    });
    
  } catch (err) {
    console.log("❌ FULL ERROR:", err);
    console.log("Error name:", err.name);
    console.log("Error message:", err.message);
    
    res.status(500).json({
      status: 0,
      message: "Error in saving education data",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

//--------------------------------------------------------- //

// GET Education Data Controller - JWT auth required
const getEducationData = async (req, res) => {
  try {
    let userId = req.user.id;
    
    console.log("Fetching education data for userId:", userId);
    
    let educationData = await EducationData.findOne({ userId: userId });
    
    if (!educationData) {
      return res.send({
        status: 0, 
        message: "Education data not found", 
        data: null
      });
    }
    
    console.log("Education data found:", educationData);
    
    // Create full certificate URL
    let fullCertificateUrl = "";
    if (educationData.certificateUrl) {
      let cleanPath = educationData.certificateUrl.replace(/^\//, '');
      fullCertificateUrl = `http://127.0.0.1:8020/${cleanPath}`;
      console.log("Certificate URL created:", fullCertificateUrl);
    }
    
    let responseData = {
      University: educationData.university || "",
      Degree: educationData.degree || "",
      Specialization: educationData.specialization || "",
      StartDate: educationData.startDate,
      EndDate: educationData.endDate,
      CertificateUrl: fullCertificateUrl,
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

module.exports = {
  EducationReceive,
  getEducationData
};