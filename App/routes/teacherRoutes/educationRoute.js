let express = require ("express");

const { EducationReceive,getEducationData } = require ("../../controllers/tutor/educationController");

let educationRouter = express.Router();


const upload = require('../../middlewares/multer');
const auth = require('../../middlewares/auth');
//------------------------------------------// Education Routes
educationRouter.post("/createeducation", auth ,upload.single('certificate'), EducationReceive);

educationRouter.get("/geteducation", auth, getEducationData);

module.exports = educationRouter;