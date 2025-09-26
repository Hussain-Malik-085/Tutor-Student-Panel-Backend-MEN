// routes/teacherRoutes.js
const express = require("express");
const teacherCard = express.Router();
const { getTeachersCardProfileData } = require("../../controllers/StudentNavigation/getTeachersCardProfileController");

teacherCard.get("/tutorcardprofile", getTeachersCardProfileData );

module.exports = teacherCard;
