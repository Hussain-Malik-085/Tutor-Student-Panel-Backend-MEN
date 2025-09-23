// routes/teacherRoutes.js
const express = require("express");
const teacherCard = express.Router();
const { getTeachersCardData } = require("../../controllers/TutorNavigation/getTeachersCardController");

teacherCard.get("/tutorcard", getTeachersCardData );

module.exports = teacherCard;
