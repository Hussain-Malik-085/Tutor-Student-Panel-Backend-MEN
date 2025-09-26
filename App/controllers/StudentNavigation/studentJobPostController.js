// controllers/studentJobPostController.js
const JobPost = require("../../Models/studentJobPostModel/StudentJobPost");

// Final submission - jab sab data complete ho
const studentJobPostController = async (req, res) => {
  try {
    const { jobTitle, jobType, jobLocation, interests, experience, details } = req.body;
    const userId = req.user.id; // JWT middleware se aata hai

    if (!jobTitle) {
      return res.status(400).json({ message: "Job title is required" });
    }

    if (jobType && !["Onsite", "Remote", "Hybrid"].includes(jobType)) {
      return res.status(400).json({ message: "Invalid job type" });
    }

    const newJob = new JobPost({
      student: userId,
      jobTitle,
      jobType: jobType || "Onsite",
      jobLocation,
      interests: interests || [],
      experience,
      details,
    });
    console.log(newJob);

    const savedJob = await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job post created successfully",
      data: savedJob,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Job post not created",
      error: err.message,
    });
  }
};

module.exports = { studentJobPostController };