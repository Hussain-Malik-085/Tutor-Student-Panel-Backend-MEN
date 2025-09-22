


let express = require ("express");

const { uploadProfilePicture ,getProfilePic} = require ("../../controllers/student/studentProfilePicController");

let StudentpictureRouter  = express.Router();


const upload = require('../../middlewares/multer');
const auth = require('../../middlewares/auth');


//-----------------------------------------// Profile Picture Routes

StudentpictureRouter.post("/profilepicture", auth , upload.single('profilePicture'), uploadProfilePicture);

StudentpictureRouter.get("/getprofilepicture", auth, getProfilePic);


module.exports = StudentpictureRouter;


