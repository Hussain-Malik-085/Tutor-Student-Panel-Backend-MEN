

// routes/StudentNavigationRoutes/JobPostRoutes.js
const express = require("express");
const StudentJobPost = express.Router();
const { studentJobPostController } = require("../../controllers/StudentNavigation/studentJobPostController");

const auth = require('../../middlewares/auth');

// ✅ Final submission route - jab sab data complete ho
StudentJobPost.post("/studentjobpost", auth, studentJobPostController);

module.exports = StudentJobPost;