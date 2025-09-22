let express = require("express");
const { AcademicInfoProfile, getAcademicInfoProfile } = require("../../controllers/student/academicinfoController");

let AcademicInfoRoutes = express.Router();

const auth = require('../../middlewares/auth');

//------------------ Basic Info ------------------//
// ✅ Auth middleware add karo
AcademicInfoRoutes.post("/academicinfo", auth, AcademicInfoProfile);  

//------------------ Get Basic Info ------------------//
// ✅ Auth middleware add karo
AcademicInfoRoutes.get("/getacademicinfo", auth, getAcademicInfoProfile); 

module.exports = AcademicInfoRoutes;