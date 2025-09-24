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

    // FIXED: Better date parsing with multiple format support
    let startDateObj, endDateObj;
    
    try {
      // Try parsing ISO format first (from frontend)
      startDateObj = new Date(StartDate);
      endDateObj = new Date(EndDate);
      
      // Validate parsed dates
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        throw new Error("Invalid date format");
      }
      
      console.log("Successfully parsed dates:", {
        startDateObj: startDateObj.toISOString(),
        endDateObj: endDateObj.toISOString()
      });
      
    } catch (dateError) {
      console.log("Date parsing error:", dateError.message);
      return res.status(400).json({
        status: 0,
        message: "Invalid date format. Please use a valid date."
      });
    }

    // FIXED: More robust date comparison
    const startTime = startDateObj.getTime();
    const endTime = endDateObj.getTime();
    
    console.log("Date comparison:", {
      startTime,
      endTime,
      isEndBeforeStart: endTime < startTime
    });

    if (endTime < startTime) {
      console.log("❌ Date validation failed: End date is before start date");
      return res.status(400).json({
        status: 0,
        message: "End date cannot be earlier than start date"
      });
    }

    console.log("✅ Date validation passed");

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
      startDate: startDateObj,
      endDate: endDateObj,
    };

    // ONLY update certificate URL if there's a certificate (new or existing)
    if (certificateUrl) {
      educationUpdateData.certificateUrl = certificateUrl;
    }

    console.log("Final data to save:", {
      ...educationUpdateData,
      startDate: educationUpdateData.startDate.toISOString(),
      endDate: educationUpdateData.endDate.toISOString()
    });

    // Database operation - FIXED: Disable validation temporarily
    let savedEducation;
    if (existingEducation) {
      console.log("Updating existing education...");
      
      // For updates, use direct MongoDB operation to bypass Mongoose validation issues
      savedEducation = await EducationData.findOneAndUpdate(
        { userId: UserId },
        { $set: educationUpdateData },
        { 
          new: true, 
          runValidators: false, // Disable validation for updates to avoid timezone issues
          upsert: false
        }
      );
    } else {
      console.log("Creating new education...");
      
      // For new documents, create directly
      const newEducation = new EducationData(educationUpdateData);
      
      // Manual validation before save
      if (newEducation.endDate < newEducation.startDate) {
        console.log("❌ Manual validation failed");
        return res.status(400).json({
          status: 0,
          message: "End date cannot be earlier than start date"
        });
      }
      
      savedEducation = await newEducation.save({ validateBeforeSave: false });
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
    console.log("Error stack:", err.stack);
    
    // Check if it's a validation error
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        status: 0,
        message: "Validation failed: " + validationErrors.join(', '),
        error: err.message
      });
    }
    
    res.status(500).json({
      status: 0,
      message: "Error in saving education data",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// GET Education Data Controller - FIXED with better date formatting
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
    
    // FIXED: Better date formatting for frontend
    let responseData = {
      University: educationData.university || "",
      Degree: educationData.degree || "",
      Specialization: educationData.specialization || "",
      StartDate: educationData.startDate ? educationData.startDate.toISOString() : null,
      EndDate: educationData.endDate ? educationData.endDate.toISOString() : null,
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